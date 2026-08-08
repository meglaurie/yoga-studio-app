import FeatureSplit from "@/components/layout/FeatureSplit";
import Section from '../ui/Section';

export default function CTA() {
  return (
    <Section className="cta">
      <FeatureSplit 
        image={"/imgs/mandala-svgrepo-com 1.png"} 
        imageAlt={"mandala"} 
        title={" Ready to start your yoga journey?"} 
        description={" Join our community and experience the benefits of yoga today."}
        buttonText={"Sign Up Now"}
        reverse={false}
        />
      </Section>
  )
}
