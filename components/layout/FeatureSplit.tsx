import clsx from 'clsx';
import Button from '../ui/Button';
import { Heading } from '../ui/Heading';
import Text from '../ui/Text';

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
    <>
      <section
      className={clsx('feature-split', {
        'feature-split--reverse': reverse,
      })}
      >
      <div className="feature-split__image">
        <img src={image} alt={imageAlt} />
      </div>

      <div className="feature-split__content">
        <Heading as="h2" size="h2">
          {title}
        </Heading>
        <Text>{description}</Text>

        {buttonText && (
          <Button>
            {buttonText}
          </Button>
        )}
      </div>
     
    </section>
     <hr className="feature-split__divider" />
    </>
  );
}
