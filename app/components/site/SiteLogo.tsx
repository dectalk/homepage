import paul from "../../assets/pau16a.gif";
import betty from "../../assets/bet16a.gif";
import harry from "../../assets/har16a.gif";
import frank from "../../assets/fra16a.gif";
import dennis from "../../assets/den16a.gif";
import kid from "../../assets/kid16a.gif";
import ursula from "../../assets/urs16a.gif";
import rita from "../../assets/rit16a.gif";
import wendy from "../../assets/wen16a.gif";

const images = [betty, harry, frank, dennis, kid, ursula, rita, wendy];

const SiteLogo = () => {
  return (
    <div className="decde-site-logo--container">
      <img
        alt="DECtalk speak.exe window buttons"
        src={paul}
        className="decde-site-logo--image"
      />
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
