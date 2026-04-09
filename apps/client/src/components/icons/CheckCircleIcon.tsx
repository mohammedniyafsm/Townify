import React from "react";

type IconProps = {
  size?: number;                // px size (width/height)
  color?: string;               // fill color or 'currentColor'
  className?: string;           // extra classes
  title?: string | null;        // accessible title (null => aria-hidden)
  style?: React.CSSProperties;
};

export const CheckCircleIcon: React.FC<IconProps> = ({
  size = 16,
  color = "currentColor",
  className,
  title = null,
  style,
}) => {
  const labelled = !!title;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      role={labelled ? "img" : "img"}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title! : undefined}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {title ? <title>{title}</title> : null}
      <path fillRule="evenodd" clipRule="evenodd"
        d="M8 1.00195C4.13401 1.00195 1 4.13596 1 8.00195C1 11.8679 4.13401 15.002 8 15.002C11.866 15.002 15 11.8679 15 8.00195C15 4.13596 11.866 1.00195 8 1.00195ZM12.101 6.10299C12.433 5.77105 12.433 5.23286 12.101 4.90091C11.7691 4.56897 11.2309 4.56897 10.899 4.90091L6.5 9.29987L5.10104 7.90091C4.7691 7.56897 4.2309 7.56897 3.89896 7.90091C3.56701 8.23286 3.56701 8.77105 3.89896 9.10299L5.89896 11.103C6.2309 11.4349 6.7691 11.4349 7.10104 11.103L12.101 6.10299Z"
      />
    </svg>
  );
};
