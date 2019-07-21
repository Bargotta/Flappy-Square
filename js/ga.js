function nextGeneration() {
  console.log('next generation');
  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = pickOne();
  }
  for (let i = 0; i < TOTAL; i++) {
    savedBirds[i].dispose();
  }
  savedBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;
  let bird = savedBirds[index];
  let child = new Bird((canvas.width - birdSize.width) / 2, (canvas.height - birdSize.height) / 2, bird.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;
  for (let bird of savedBirds) {
    sum += bird.score;
  }
  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}