module.exports.Screencap = function (row) {
    this.id = Buffer.from(row.SK).toString('base64');
    this.date = row.SK.split("#")[2];
    this.bookmarked = Boolean(row.BookmarkedAt);
    this.path = row.Path;
    this.status = row.SK.split('#')[1];
    this.failureReason = row.FailureReason;
    this.website = row.Website;
}
