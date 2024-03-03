function createRestartButton() {
  const restartButton = document.querySelector(".title");
  const textAnimation = document.querySelector(".text-stroke");

  const setAnimationName = (element, animationName) => {
    element && (element.style.animationName = animationName);
  };

  restartButton.addEventListener(
    "click",
    () => {
      setAnimationName(textAnimation, "none");
      requestAnimationFrame(() =>
        setTimeout(() => setAnimationName(textAnimation, ""), 0)
      );
    },
    false
  );
}

createRestartButton();
