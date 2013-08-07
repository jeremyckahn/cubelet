var htmlTemplate = [
    '<div class="cubelet-cube">'
      ,'<figure class="cubelet-front"></figure>'
      ,'<figure class="cubelet-back"></figure>'
      ,'<figure class="cubelet-right"></figure>'
      ,'<figure class="cubelet-left"></figure>'
      ,'<figure class="cubelet-top"></figure>'
      ,'<figure class="cubelet-bottom"></figure>'
    ,'</div>'
  ].join('');


var cssTemplate = [
     '.cubelet-front  { __VENDOR__transform: rotateY(   0deg ) translateZ( 100px ); }'
    ,'.cubelet-back   { __VENDOR__transform: rotateX( 180deg ) translateZ( 100px ); }'
    ,'.cubelet-right  { __VENDOR__transform: rotateY(  90deg ) translateZ( 100px ); }'
    ,'.cubelet-left   { __VENDOR__transform: rotateY( -90deg ) translateZ( 100px ); }'
    ,'.cubelet-top    { __VENDOR__transform: rotateX(  90deg ) translateZ( 100px ); }'
    ,'.cubelet-bottom { __VENDOR__transform: rotateX( -90deg ) translateZ( 100px ); }'
].join('');
