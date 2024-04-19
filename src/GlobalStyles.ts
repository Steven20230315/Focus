import { createGlobalStyle } from 'styled-components';
const GlobalStyles = createGlobalStyle`

body{
  margin: 0;
  background-color: #bebdbd;
  box-sizing: border-box;
}
*{
  box-sizing: border-box;
}

:root{
  --top-nav-height: 70px;
}

#root{
  display: flex;
  flex-direction: column;
  min-width: 1280px;
  width: 100vw;
  height: 100vh;
}

.container{
  display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 0.5rem;
	border: 1px solid black;
  height: calc(100vh - var(--top-nav-height));
}


`;

export default GlobalStyles;
