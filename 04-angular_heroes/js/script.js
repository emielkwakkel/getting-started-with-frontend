angular.module('heroes',[]).run()

.controller('herotable', function($log){
  this.heroes = [
    {
      name: 'Batman',
      power: 'Money',
    },
    {
      name: 'Wonder Woman',
      power: 'Superstrength',
    },
    {
      name: 'Iron Man',
      power: 'Money',
    },
    {
      name: 'Superman',
      power: 'Everything',
    },
    {
      name: 'Aquaman',
      power: 'Fish',
    },
    {
      name: 'Black Panther',
      power: 'Money',
    },
    {
      name: 'Hulk',
      power: 'Superstrength',
    },
    {
      name: 'Superkwakkie',
      power: 'Awesome code',
    },
    {
      name: 'Captain Iglo',
      power: 'Fish',
    }
  ];
});
