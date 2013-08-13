var htmlTemplate = [
    '<div class="cubelet-container">'
      ,'<div class="cubelet-cube">'
        ,'<figure class="cubelet-front"></figure>'
        ,'<figure class="cubelet-back"></figure>'
        ,'<figure class="cubelet-right"></figure>'
        ,'<figure class="cubelet-left"></figure>'
        ,'<figure class="cubelet-top"></figure>'
        ,'<figure class="cubelet-bottom"></figure>'
      ,'</div>'
      ,'<div class="cubelet-rotation-arm">'
        ,'<div class="cubelet-rotation-handle"></div>'
      ,'</div>'
    ,'</div>'
  ].join('');


var cssTemplate = [
    '.cubelet-container,'
    ,'.cubelet-cube {'
      ,'height: 100%;'
      ,'width: 100%; }'
    ,'.cubelet-cube {'
      ,'__VENDOR__transform: translateZ(-100px) rotateY(0deg) rotateX(0deg); '
      ,'__VENDOR__transform-style: preserve-3d; }'
    ,'.cubelet-cube figure {'
      ,'margin: 0;'
      ,'position: absolute;'
      ,'height: 100%;'
      ,'width: 100%; }'
    ,'.cubelet-front {'
      ,'__VENDOR__transform: rotateY(0deg) translateZ(50px); }'
    ,'.cubelet-back {'
      ,'__VENDOR__transform: rotateX(180deg) translateZ(50px);'
      ,'background: #fb0; }'
    ,'.cubelet-right {'
      ,'__VENDOR__transform: rotateY(90deg) translateZ(50px);'
      ,'background: #00cc4e; }'
    ,'.cubelet-left {'
      ,'__VENDOR__transform: rotateY(-90deg) translateZ(50px);'
      ,'background: #06f; }'
    ,'.cubelet-top {'
      ,'__VENDOR__transform: rotateX(90deg) translateZ(50px);'
      ,'background: #f77; }'
    ,'.cubelet-bottom {'
      ,'__VENDOR__transform: rotateX(-90deg) translateZ(50px);'
      ,'background: #b00; }'
    ,'.cubelet-rotation-arm {'
      ,'cursor: ew-resize;'
      ,'bottom: 50%;'
      ,'background: #fff;'
      ,'border-left: dotted #000 2px;'
      ,'left: 50%;'
      ,'position: absolute;'
      ,'height: 125px;'
      ,'width: 0; }'
    ,'.cubelet-rotation-handle {'
      ,'background: #444;'
      ,'border: solid #000 2px;'
      ,'border-radius: 50%;'
      ,'height: 10px;'
      ,'left: -8px;'
      ,'position: absolute;'
      ,'right: 8%;'
      ,'width: 10px; }'
].join('\n');
