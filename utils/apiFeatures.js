class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filtering() {
    //Making a copy of Query
    const queryTemp = { ...this.queryObj };
    //preventing from polluting the query
    const exculdedfields = ["page", "sort", "limit", "fields"];
    exculdedfields.forEach((ele) => delete queryTemp[ele]);

    //Advance Filtering
    let queryStr = JSON.stringify(queryTemp);
    queryStr = queryStr.replace(/\b(lte|lt|gt|gte)\b/g, (match) => `$${match}`);

    //Storing the Query Output After Filtering
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    //Sorting the query
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(",").join(" ");
      this.query.sort(sortBy);
    } else {
      this.query.sort("price");
    }

    return this;
  }

  fielding() {
    //Selecting the fields
    if (this.queryObj.fields) {
      const selectBy = this.queryObj.fields.split(",").join(" ");
      this.query.select(selectBy);
    } else {
      this.query.select("-__v");
    }
    return this;
  }

  paging() {
    //Paging the query
    if (this.queryObj.page || this.queryObj.limit) {
      const limit = this.queryObj.limit * 1 || 10;
      const page = this.queryObj.page * 1 || 1;
      const skip = (page - 1) * limit;

      this.query.skip(skip).limit(limit);
    } else {
      this.query.skip(0).limit(0);
    }

    return this;
  }
}

module.exports = ApiFeatures;
