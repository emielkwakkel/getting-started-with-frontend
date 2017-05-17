var heroes = [
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

// The following code is needed to add each hero to our table
for(var i=0;i<heroes.length;i++){
  var newrow = document.createElement('tr');
  var hero = document.createElement('td');
  hero.appendChild(document.createTextNode(heroes[i].name));
  var power = document.createElement('td');
  power.appendChild(document.createTextNode(heroes[i].power));
  newrow.appendChild(hero);
  newrow.appendChild(power);
  document.getElementById('heroes').appendChild(newrow);
}
