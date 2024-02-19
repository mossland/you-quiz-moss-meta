<template>
  <footer>
    <h1>유퀴즈</h1>
    <a href="mailto:contact@you-quiz.com">contact@you-quiz.com</a>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  box-sizing: border-box;
  width: 100%;
  padding: 2em 0 2.3em 0;
  background: var(--footer-background);
  color: var(--footer-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    font-family: book;
    font-size: 1.1em;
    font-weight: 200;
    margin: 0;
  }
  a {
    margin-top: 0.6em;
    text-decoration: none;
    font-family: jamsil;
    font-size: 0.9em;
    font-weight: 100;
    color: var(--footer-text);
  }
}
</style>