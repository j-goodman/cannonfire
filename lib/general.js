var General = function (object) {
  this.army = object.army;
};

General.prototype.act = function () {
  console.log('Commanding: ', this.army);
};
