class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //copy request query using spread operator
    const requestQuery = { ...this.queryString };
    const excludeQuery = ['page', 'sort', 'limit', 'fields'];

    //filtered the query by delete if the excludeQuery exist in requestQuery
    excludeQuery.forEach((el) => delete requestQuery[el]);

    //advanced filtering
    let queryStr = JSON.stringify(requestQuery);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (word) => `$${word}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      //if have multiple sorting query
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //default sorting
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //projecting query
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    //pagination

    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
