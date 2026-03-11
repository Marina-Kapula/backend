// backend/sculpturesStore.js

let sculptures = [
  {
    id: 1,
    title: "Bear",
    description: "",
    images: ["https://via.placeholder.com/800x600"],
  },
  {
    id: 2,
    title: "Watcher I",
    description: "",
    images: ["https://via.placeholder.com/800x600"],
  },
  {
    id: 3,
    title: "Stone figure",
    description: "",
    images: ["https://via.placeholder.com/800x600"],
  },
];

let nextId = 4;

function getAll() {
  return sculptures;
}

function addSculpture(title, description, imageUrls) {
  const sculpture = {
    id: nextId++,
    title,
    description,
    images: imageUrls,
  };
  sculptures.push(sculpture);
  return sculpture;
}

function removeSculpture(id) {
  const before = sculptures.length;
  sculptures = sculptures.filter((s) => s.id !== id);
  return sculptures.length < before;
}

module.exports = {
  getAll,
  addSculpture,
  removeSculpture,
};
