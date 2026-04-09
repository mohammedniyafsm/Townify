import LogoLoop from '../ui/LogoLoop';

const imageLogos = [
  // Previous batch
  { src: "https://images.seeklogo.com/logo-png/63/1/griddo-logo-png_seeklogo-632720.png", alt: "Griddo", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/63/1/crylo-logo-png_seeklogo-631814.png", alt: "Crylo", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/63/1/bluefiles-logo-png_seeklogo-633387.png", alt: "Bluefiles", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/63/1/duocon-logo-png_seeklogo-633165.png", alt: "Duocon", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/63/1/mochimin-logo-png_seeklogo-633130.png", alt: "Mochimin", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/62/1/avalonia-ui-logo-png_seeklogo-627365.png", alt: "Avalonia UI", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/63/1/nulivo-logo-png_seeklogo-633244.png", alt: "Nulivo", href: "#" },
  
  // NEW ONES YOU JUST SENT
  { src: "https://images.seeklogo.com/logo-png/62/1/egune-logo-png_seeklogo-627274.png", alt: "Egune", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/62/1/ledn-logo-png_seeklogo-627029.png", alt: "Ledn", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/64/1/calspan-logo-png_seeklogo-647277.png", alt: "Calspan", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/64/1/cyient-logo-png_seeklogo-647074.png", alt: "Cyient", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/20/1/palmeiras-logo-png_seeklogo-204522.png", alt: "Palmeiras", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/62/1/moixa-logo-png_seeklogo-628906.png", alt: "Moixa", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/23/1/bca-bank-logo-png_seeklogo-232742.png", alt: "BCA Bank", href: "#" },
    { src: "https://images.seeklogo.com/logo-png/62/1/sematext-logo-png_seeklogo-627023.png", alt: "Sematext", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/20/1/elo-logo-png_seeklogo-205447.png", alt: "Elo", href: "#" },
  { src: "https://images.seeklogo.com/logo-png/64/1/affinity-logo-png_seeklogo-644010.png", alt: "Affinity", href: "#" },
];



function LandingLoop() {
  return (

    <div className="py-20 ">

        <div className="flex justify-center">
            <h1 className='font-inter font-semibold'>The Most Trusted Virtual Office App</h1>
        </div>
   
    <div className='py-10' style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
        

      <LogoLoop
        logos={imageLogos}
        speed={40}
        direction="left"
        logoHeight={120}
        gap={100}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Big Tech Companies"
      />

     
    </div>
     </div>
  );
}

export default LandingLoop;
