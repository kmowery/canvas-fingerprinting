
function Barrier(f) {
  this.f = f;

  this.registered = 0;
  this.outstanding = {"size":0};
}

Barrier.prototype.run = function() {
  if(this.outstanding.size == 0) {
    this.f();
  }
}

// Returns a tag. Pass this tag in to notify when you're ready.
Barrier.prototype.register = function() {
  var i = this.registered;
  this.registered++;

  this.outstanding[i] = true;
  this.outstanding.size++;
  return i;
}

Barrier.prototype.notify = function(tag) {
  if(tag in this.outstanding) {
    delete(this.outstanding[tag]);
    this.outstanding.size--;
  }

  this.run();
}

