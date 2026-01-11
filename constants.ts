import { Category, Difficulty, WordPack } from './types';

export const CATEGORIES: Category[] = [
  { id: 'custom', name: 'Custom Pot', icon: '✨', isCustom: true }, // New Custom Category
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'food', name: 'Food & Cuisine', icon: '🍔' },
  { id: 'objects', name: 'Objects & Things', icon: '💡' },
  { id: 'school', name: 'School & Learning', icon: '📚' },
  { id: 'geo', name: 'Geography', icon: '🌍' },
  { id: 'movies', name: 'Movies & TV', icon: '🎬' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'tech', name: 'Technology', icon: '💻' },
  { id: 'jobs', name: 'Jobs', icon: '💼' },
  { id: 'places', name: 'Places', icon: '🏛️' },
  // New Categories
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'science', name: 'Science', icon: '🧪' },
  { id: 'gaming', name: 'Video Games', icon: '🎮' },
  { id: '90s', name: '90s Nostalgia', icon: '💾' },
  { id: 'fantasy', name: 'Fantasy', icon: '🐉' },
  { id: 'nature', name: 'Nature', icon: '🌲' },
  { id: 'colors', name: 'Colors', icon: '🎨' },
];

export const WORD_DATA: WordPack = {
  animals: {
    [Difficulty.EASY]: ['Dog', 'Cat', 'Lion', 'Elephant', 'Monkey', 'Fish', 'Bird', 'Cow', 'Pig', 'Duck'],
    [Difficulty.MEDIUM]: ['Giraffe', 'Kangaroo', 'Penguin', 'Dolphin', 'Shark', 'Octopus', 'Eagle', 'Owl', 'Wolf'],
    [Difficulty.HARD]: ['Platypus', 'Narwhal', 'Axolotl', 'Pangolin', 'Lemur', 'Capybara', 'Komodo Dragon']
  },
  food: {
    [Difficulty.EASY]: ['Pizza', 'Burger', 'Apple', 'Banana', 'Ice Cream', 'Bread', 'Egg', 'Cheese', 'Cake'],
    [Difficulty.MEDIUM]: ['Sushi', 'Tacos', 'Spaghetti', 'Salad', 'Steak', 'Pancakes', 'Waffles', 'Soup'],
    [Difficulty.HARD]: ['Escargot', 'Caviar', 'Tiramisu', 'Croissant', 'Paella', 'Haggis', 'Kimchi']
  },
  objects: {
    [Difficulty.EASY]: ['Table', 'Chair', 'Bed', 'Phone', 'Cup', 'Spoon', 'Car', 'Ball', 'Book'],
    [Difficulty.MEDIUM]: ['Umbrella', 'Laptop', 'Camera', 'Watch', 'Glasses', 'Mirror', 'Wallet', 'Keys'],
    [Difficulty.HARD]: ['Microscope', 'Telescope', 'Compass', 'Thermometer', 'Stapler', 'Calculator']
  },
  school: {
    [Difficulty.EASY]: ['Pencil', 'Teacher', 'Desk', 'Bus', 'Lunch', 'Recess', 'Math', 'Art'],
    [Difficulty.MEDIUM]: ['Science', 'History', 'Principal', 'Library', 'Homework', 'Project', 'Test'],
    [Difficulty.HARD]: ['Calculus', 'Chemistry', 'Thesis', 'Semester', 'Graduation', 'Diploma']
  },
  geo: {
    [Difficulty.EASY]: ['USA', 'China', 'France', 'Italy', 'Japan', 'Ocean', 'Mountain', 'River'],
    [Difficulty.MEDIUM]: ['Brazil', 'Egypt', 'Australia', 'Canada', 'London', 'Paris', 'Tokyo', 'Desert'],
    [Difficulty.HARD]: ['Antarctica', 'Himalayas', 'Amazon Rainforest', 'Sahara', 'Madagascar', 'Iceland']
  },
  movies: {
    [Difficulty.EASY]: ['Cartoon', 'Hero', 'Villain', 'Action', 'Comedy', 'Popcorn', 'Cinema'],
    [Difficulty.MEDIUM]: ['Director', 'Actor', 'Script', 'Horror', 'Sci-Fi', 'Oscar', 'Hollywood'],
    [Difficulty.HARD]: ['Cinematography', 'Protagonist', 'Antagonist', 'Documentary', 'CGI', 'Cameo']
  },
  music: {
    [Difficulty.EASY]: ['Song', 'Dance', 'Drum', 'Guitar', 'Piano', 'Singer', 'Radio'],
    [Difficulty.MEDIUM]: ['Concert', 'Album', 'Band', 'Jazz', 'Rock', 'Pop', 'Violin'],
    [Difficulty.HARD]: ['Symphony', 'Orchestra', 'Conductor', 'Synthesizer', 'Acoustic', 'Harmony']
  },
  sports: {
    [Difficulty.EASY]: ['Soccer', 'Basketball', 'Tennis', 'Run', 'Jump', 'Swim', 'Ball'],
    [Difficulty.MEDIUM]: ['Baseball', 'Golf', 'Volleyball', 'Hockey', 'Coach', 'Referee', 'Stadium'],
    [Difficulty.HARD]: ['Triathlon', 'Gymnastics', 'Fencing', 'Cricket', 'Rugby', 'Marathon']
  },
  tech: {
    [Difficulty.EASY]: ['Phone', 'Computer', 'Robot', 'Game', 'App', 'Internet', 'Wifi'],
    [Difficulty.MEDIUM]: ['Keyboard', 'Mouse', 'Screen', 'Battery', 'Charger', 'Email', 'Text'],
    [Difficulty.HARD]: ['Algorithm', 'Server', 'Database', 'Encryption', 'Blockchain', 'Artificial Intelligence']
  },
  jobs: {
    [Difficulty.EASY]: ['Doctor', 'Police', 'Firefighter', 'Chef', 'Farmer', 'Pilot', 'Artist'],
    [Difficulty.MEDIUM]: ['Engineer', 'Lawyer', 'Scientist', 'Writer', 'Actor', 'Nurse', 'Dentist'],
    [Difficulty.HARD]: ['Astronaut', 'Architect', 'Psychologist', 'Politician', 'Journalist', 'Archaeologist']
  },
  places: {
    [Difficulty.EASY]: ['Home', 'Park', 'School', 'Store', 'Zoo', 'Beach', 'Farm'],
    [Difficulty.MEDIUM]: ['Airport', 'Hospital', 'Library', 'Museum', 'Cinema', 'Restaurant', 'Hotel'],
    [Difficulty.HARD]: ['University', 'Cathedral', 'Stadium', 'Skyscraper', 'Observatory', 'Laboratory']
  },
  fantasy: {
    [Difficulty.EASY]: ['Dragon', 'Magic', 'King', 'Queen', 'Ghost', 'Witch', 'Giant'],
    [Difficulty.MEDIUM]: ['Wizard', 'Elf', 'Fairy', 'Castle', 'Potion', 'Monster', 'Unicorn'],
    [Difficulty.HARD]: ['Phoenix', 'Werewolf', 'Vampire', 'Sorcerer', 'Dungeon', 'Mermaid', 'Centaur']
  },
  nature: {
    [Difficulty.EASY]: ['Sun', 'Moon', 'Star', 'Tree', 'Flower', 'Rain', 'Snow'],
    [Difficulty.MEDIUM]: ['Forest', 'Jungle', 'River', 'Lake', 'Volcano', 'Cloud', 'Wind'],
    [Difficulty.HARD]: ['Tornado', 'Hurricane', 'Waterfall', 'Canyon', 'Glacier', 'Ecosystem']
  },
  colors: {
    [Difficulty.EASY]: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink'],
    [Difficulty.MEDIUM]: ['Black', 'White', 'Gray', 'Brown', 'Gold', 'Silver', 'Rainbow'],
    [Difficulty.HARD]: ['Turquoise', 'Magenta', 'Cyan', 'Indigo', 'Violet', 'Beige', 'Maroon']
  },
  history: {
      [Difficulty.EASY]: ['War', 'King', 'Queen', 'Pyramid', 'Castle', 'Viking', 'Knight'],
      [Difficulty.MEDIUM]: ['Revolution', 'Empire', 'Pharaoh', 'Samurai', 'Gladiator', 'Discovery'],
      [Difficulty.HARD]: ['Renaissance', 'Industrial', 'Colonialism', 'Dynasty', 'Inquisition']
  },
  science: {
      [Difficulty.EASY]: ['Space', 'Atom', 'Cell', 'Planet', 'Magnet', 'Gravity'],
      [Difficulty.MEDIUM]: ['DNA', 'Bacteria', 'Galaxy', 'Fossil', 'Energy', 'Chemical'],
      [Difficulty.HARD]: ['Quantum', 'Relativity', 'Photosynthesis', 'Neutron', 'Black Hole']
  },
  gaming: {
      [Difficulty.EASY]: ['Mario', 'Controller', 'Level', 'Boss', 'Jump', 'Win'],
      [Difficulty.MEDIUM]: ['Minecraft', 'Fortnite', 'Zelda', 'Console', 'Multiplayer', 'Quest'],
      [Difficulty.HARD]: ['RPG', 'Speedrun', 'Hitbox', 'Glitch', 'Esports', 'NPC']
  },
  '90s': {
      [Difficulty.EASY]: ['VCR', 'Cassette', 'Discman', 'Tamagotchi', 'Titanic', 'Pokemon'],
      [Difficulty.MEDIUM]: ['Dial-up', 'Beanie Baby', 'Gameboy', 'Friends', 'Nirvana'],
      [Difficulty.HARD]: ['Y2K', 'Grunge', 'Macarena', 'Walkman', 'Floppy Disk']
  }
};