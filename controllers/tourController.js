const Tour = require('./../models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid body: Missing name or price'
    });
  }
  next();
};

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ragingsAverage, price';
  req.query.fields = 'name,price, ratingsAverage, summary, difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //one method for each feature
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //default sorting
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //4) pagination
    // const page = req.query.page * 1 || 1; //convert to a number or 1
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // // page=3&limit=10
    // query = query.skip(skip).limit(limit);
    if (this.queryString.page) {
      const page = this.queryString.page * 1 || 1; //convert to a number or 1
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    // BUILD THE QUERY
    // 1A) Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);
    // //console.log(req.query, queryObj);

    // // 1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    //gt, gte, lt, lte
    // console.log(JSON.parse(queryStr));

    // { difficulty: easy, duration: { $gte: 5}}
    // { duration: { gte: '5' }, difficulty: 'easy' }

    // full path example:
    // const tours =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   //default sorting
    //   query = query.sort('-createdAt');
    // }

    // 4) Pagination
    // const page = req.query.page * 1 || 1; //convert to a number or 1
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // // page=3&limit=10
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist!');
    // }

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id: req.params.id });
    if (tour !== null) {
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    } else {
      throw new Error({ message: 'Tour is not presented' });
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data were send!'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
