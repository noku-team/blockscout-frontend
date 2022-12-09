/* eslint-disable max-len */
import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const adbutlerHTML = require('ui/shared/ad/adbutler.html');

// didn't find a way to raw-load html that works both for webpack (app build) and vite (playwright build)
const adbutlerHTML = `
  <div id="ad-banner"></div>
  <script type="text/javascript">if (!window.AdButler){(function(){var s = document.createElement("script"); s.async = true; s.type = "text/javascript";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(s, n);}());}</script>
  <script type="text/javascript">
  var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];
  var abkw = window.abkw || '';
  const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  if (isMobile) {
      var plc539876 = window.plc539876 || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_539876_'+plc539876+'"></'+'div>';
      document.getElementById("ad-banner").className = "ad-container mb-3";
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, 539876, [320,100], 'placement_539876_'+opt.place, opt); }, opt: { place: plc539876++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  } else {
      var plc523705 = window.plc523705 || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_523705_'+plc523705+'"></'+'div>';
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, 523705, [728,90], 'placement_523705_'+opt.place, opt); }, opt: { place: plc523705++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  }
  </script>
`;

const AdbutlerBanner = ({ className }: { className?: string }) => {
  return (
    <Flex className={ className } dangerouslySetInnerHTML={{ __html: adbutlerHTML }}/>
  );
};

export default chakra(AdbutlerBanner);
