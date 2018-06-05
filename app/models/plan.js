import DS from 'ember-data';

const Plan = DS.Model.extend({
  planId: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  price: DS.attr('number'),
  projectsLimit: DS.attr("number"),
  monthlyUrl: DS.attr('string'),
  quarterlyUrl: DS.attr('string'),
  halfYearlyUrl: DS.attr('string'),
  yearlyUrl: DS.attr('string'),
  monthlyPrice: DS.attr('string'),
  quarterlyPrice: DS.attr('string'),
  halfYearlyPrice: DS.attr('string'),
  yearlyPrice: DS.attr('string'),

  descriptionItems:(function() {
    const description = this.get("description");
    return (description != null ? description.split(",") : undefined);
  }).property("description")
});

export default Plan;