import "./About.css";
import "./Horizontal-Gallery.css";
import "./Nav.css";
import "./Project-Index.css";
import "./Project-Item.css";
import "./Styles.css";

export const metadata = {
  title: "Yokohama",
  description: "Yokohama is a refined, minimalist theme designed for creators who value subtlety and precision. With clean aesthetics and seamless navigation, it’s a timeless digital canvas—adaptable, intuitive, and built to last.

,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
