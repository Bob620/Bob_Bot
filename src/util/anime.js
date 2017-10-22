module.exports = class Anime {
  constructor(KitsuData) {
    const attributes = KitsuData.attributes;
    this.title = attributes.titles.en_jp;
    this.englishTitle = attributes.titles.en ? attributes.titles.en : 'No english name available';
    this.description = attributes.synopsis;
    this.rating = attributes.averageRating;
    this.ageRating = attributes.ageRating;
    this.ageGuide = attributes.ageRatingGuide;
  }
}
