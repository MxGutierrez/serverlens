<template>
  <div class="flex items-center text-primary space-x-4">
    <svg
      class="h-20 w-20"
      width="980"
      height="617"
      viewBox="0 0 980 617"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M586 245H838.5M138 245H390.5"
        stroke="currentColor"
        stroke-width="35"
      />
      <circle
        cx="490.5"
        cy="367.5"
        r="157.5"
        stroke="currentColor"
        stroke-width="60"
      />
      <rect
        x="229"
        y="123"
        width="108"
        height="61"
        rx="20"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M867.5 268.6C855.727 209.605 817.808 159.79 765.768 132.173C770.758 128.536 774 122.647 774 116V89C774 77.9543 765.046 69 754 69H642C630.954 69 622 77.9543 622 89V115.201C608.689 118.818 596.159 123.987 584.4 130.7C540.8 50.8 457.4 0 363 0C221.4 0 108.9 112.5 108.9 254.1V268.6C43.6 297.6 0 359.3 0 435.5C0 537.1 79.9 617 181.5 617H798.5C900.1 617 980 537.2 980 435.5C980 359.3 932.8 294 867.5 268.6ZM798.5 580.7H181.5C101.6 580.7 36.3 515.4 36.3 435.5C36.3 366.5 83.5 308.5 148.8 293.9C145.2 279.4 145.2 268.5 145.2 254C145.2 134.2 243.2 36.2 363 36.2C457.4 36.2 537.2 97.9 569.9 181.4C596.636 161.302 629.576 147.409 663 145.362V108H695H735V157.515C790.303 180.287 829.472 232.11 834.8 293.9C896.5 308.5 943.7 366.6 943.7 435.5C943.7 515.4 878.4 580.7 798.5 580.7Z"
        fill="currentColor"
      />
      <rect x="760" y="110" width="14" height="30" fill="currentColor" />
    </svg>
    <div>
      <h1 class="text-[1.6rem] sm:text-[2.1rem] leading-[2.95rem] -mt-[8px]">
        Serverlens
      </h1>
      <a
        href="https://github.com/MxGutierrez/serverlens"
        target="__blank"
        class="flex items-center space-x-2 text-black hover:text-gray-600"
      >
        <GithubLogo class="h-4 w-4" />
        <span class="text-xs">MxGutierrez/serverlens</span>
      </a>
    </div>
  </div>
</template>

<script>
import GithubLogo from "./Github";

export default {
  components: {
    GithubLogo,
  },
};
</script>
