import clsx from 'clsx';

interface FeatureSplitProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonText?: string;
  reverse?: boolean;
}

export default function FeatureSplit({
  image,
  imageAlt,
  title,
  description,
  buttonText,
  reverse = false,
}: FeatureSplitProps) {
  return (
    <section
      className={clsx('feature-split', {
        'feature-split--reverse': reverse,
      })}
    >
      <div className="feature-split__image">
        <img src={image} alt={imageAlt} />
      </div>

      <div className="feature-split__content">
        <h2>{title}</h2>
        <p>{description}</p>

        {buttonText && <button>{buttonText}</button>}
      </div>
    </section>
  );
}
