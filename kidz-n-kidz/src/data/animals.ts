export interface Animal {
  id: string;
  name: string;
  image: any; 
  sound: string;
}

export const ANIMALS: Animal[] = [
  { id: '1', name: 'Lion', image: require('../../assets/animals/lion.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/lion.mp3' },
  { id: '2', name: 'Tiger', image: require('../../assets/animals/tiger.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/tiger.mp3' },
  { id: '3', name: 'Elephant', image: require('../../assets/animals/elephant.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/elephant.mp3' },
  { id: '4', name: 'Dog', image: require('../../assets/animals/dog.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/dog.mp3' },
  { id: '5', name: 'Cat', image: require('../../assets/animals/cat.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/cat.mp3' },
  { id: '6', name: 'Cow', image: require('../../assets/animals/cow.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/cow.mp3' },
  { id: '7', name: 'Bear', image: require('../../assets/animals/bear.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/bear.mp3' },
  { id: '8', name: 'Chicken', image: require('../../assets/animals/chicken.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/chicken.mp3' },
  { id: '9', name: 'Pig', image: require('../../assets/animals/pig.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/pig.mp3' },
  { id: '10', name: 'Monkey', image: require('../../assets/animals/monkey.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/monkey.mp3' },
  { id: '11', name: 'Gorilla', image: require('../../assets/animals/gorilla.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/gorilla.mp3' },
  { id: '12', name: 'Deer', image: require('../../assets/animals/deer.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/deer.mp3' },
  { id: '13', name: 'Rabbit', image: require('../../assets/animals/rabbit.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/rabbit.mp3' },
  { id: '14', name: 'Goat', image: require('../../assets/animals/goat.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/goat.mp3' },
  { id: '15', name: 'Horse', image: require('../../assets/animals/horse.jpg'), sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/horse.mp3' },
  { id: '16', name: 'Sheep', image: 'https://images.unsplash.com/photo-1484557918186-7b4e571d4b12?w=400', sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/sheep.mp3' },
  { id: '17', name: 'Wolf', image: 'https://images.unsplash.com/photo-1551021200-a549646b9a4c?w=400', sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/wolf.mp3' },
  { id: '18', name: 'Fox', image: 'https://images.unsplash.com/photo-1516934024742-b461fbc4760a?w=400', sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/fox.mp3' },
  { id: '19', name: 'Duck', image: 'https://images.unsplash.com/photo-1465153690352-10c1b295ec0c?w=400', sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/duck.mp3' },
  { id: '20', name: 'Squirrel', image: 'https://images.unsplash.com/photo-1507666405821-422fea7c50e0?w=400', sound: 'https://raw.githubusercontent.com/shuniz/animal-sounds/master/sounds/squirrel.mp3' },
];
