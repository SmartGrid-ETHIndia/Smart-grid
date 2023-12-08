import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="About us"
            paragraph="Grid regulation for EV charging stations based on the charging patterns and electricity demands of the users, considering factors like time of the day and corresponding user demand.Using AI and the existing data available we will try to predict when and where there may be a surge in demand in the EV charging network, in turn increasing the load on the power grid. This early prediction will help us to pre-inform the authorities of the usage patterns and demands of the users and help reduce the stress produced by immediate demand on the power grid."
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
