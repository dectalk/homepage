import paul from "../../assets/dectalk_buttons/pau16a.gif";
import betty from "../../assets/dectalk_buttons/bet16a.gif";
import harry from "../../assets/dectalk_buttons/har16a.gif";
import frank from "../../assets/dectalk_buttons/fra16a.gif";
import dennis from "../../assets/dectalk_buttons/den16a.gif";
import kid from "../../assets/dectalk_buttons/kid16a.gif";
import ursula from "../../assets/dectalk_buttons/urs16a.gif";
import rita from "../../assets/dectalk_buttons/rit16a.gif";
import wendy from "../../assets/dectalk_buttons/wen16a.gif";

const images = [betty, harry, frank, dennis, kid, ursula, rita, wendy];

const SiteLogo = () => {
  return (
    <div className="decde-site-logo--container">
      <img alt="DECtalk speak.exe window buttons" src={paul} className="decde-site-logo--image" />
      {images.map((x, i) => (
        <img
          aria-hidden={false}
          key={x}
          src={x}
          className={`decde-site-logo--image decde-site-logo--animated-image decde-site-logo--animated-image-${i}`}
        />
      ))}
    </div>
  );
};

export { SiteLogo };
