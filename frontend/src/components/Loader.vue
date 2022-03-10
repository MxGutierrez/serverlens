<template>
  <div>
    <div class="icon"></div>
  </div>
</template>

<style scoped>
.icon {
  --color: var(--primary-color);
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: var(--color);
  color: var(--color);
  box-shadow: 9984px 0 0 0 var(--color), 9999px 0 0 0 var(--color),
    10014px 0 0 0 var(--color);
  -webkit-animation: dot-typing 1.5s infinite linear;
  animation: dot-typing 1.5s infinite linear;
}

@keyframes dot-typing {
  0% {
    box-shadow: 9984px 0 0 0 var(--color), 9999px 0 0 0 var(--color),
      10014px 0 0 0 var(--color);
  }
  16.667% {
    box-shadow: 9984px -10px 0 0 var(--color), 9999px 0 0 0 var(--color),
      10014px 0 0 0 var(--color);
  }
  33.333% {
    box-shadow: 9984px 0 0 0 var(--color), 9999px 0 0 0 var(--color),
      10014px 0 0 0 var(--color);
  }
  50% {
    box-shadow: 9984px 0 0 0 var(--color), 9999px -10px 0 0 var(--color),
      10014px 0 0 0 var(--color);
  }
  66.667% {
    box-shadow: 9984px 0 0 0 var(--color), 9999px 0 0 0 var(--color),
      10014px 0 0 0 var(--color);
  }
  83.333% {
    box-shadow: 9984px 0 0 0 var(--color), 9999px 0 0 0 var(--color),
      10014px -10px 0 0 var(--color);
  }
  100% {
    box-shadow: 9984px 0 0 0 var(--color), 9999px 0 0 0 var(--color),
      10014px 0 0 0 var(--color);
  }
}
</style>
