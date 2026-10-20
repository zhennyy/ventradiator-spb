// Кнопка-ссылка: основная (тёмная), «призрачная» (с рамкой) и маленькая — для шапки.
// Внутренние ссылки — обычные <a>: каждая страница сайта — отдельный готовый HTML.
import './Button.css';
export default function ButtonLink({ href, variant = 'primary', small = false, children, ...rest }) {
  const classes = ['button', small ? 'button-small' : '', `button-${variant}`].filter(Boolean).join(' ');
  return (
    <a className={classes} href={href} {...rest}>
      {children}
    </a>
  );
}
