import { assert } from 'chai';

import { addStage, Konva, cloneAndCompareLayer, isBrowser } from './test-utils';

describe('TextPath', function () {
  // ======================================================
  it('Render Text Along Line', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M 10,10 300,150';

    var path = new Konva.Path({
      stroke: 'red',
      strokeWidth: 1,
      data: c,
    });

    layer.add(path);

    var textpath = new Konva.TextPath({
      fill: 'orange',
      fontSize: 24,
      fontFamily: 'Arial',
      text: "The quick brown fox jumped over the lazy dog's back",
      data: c,
    });
    textpath.on('mouseover', function () {
      this.fill('blue');
      layer.drawScene();
    });
    textpath.on('mouseout', function () {
      this.fill('orange');
      layer.drawScene();
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      textpath.getClassName(),
      'TextPath',
      'getClassName should be TextPath'
    );

    var trace = layer.getContext().getTrace(true);
    //console.log(trace);
    assert.equal(
      trace,
      'restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();'
    );
  });

  // ======================================================
  it('Find Next Segment when Arc is in Path', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 C0,0 10,150 100,100 S300,150 40,130';
    var path = new Konva.Path({
      x: 0,
      y: 50,
      stroke: 'green',
      strokeWidth: 1,
      data: c,
    });

    layer.add(path);

    var textpath = new Konva.TextPath({
      x: 0,
      y: 50,
      fill: '#333',
      fontSize: 50,
      fontFamily: 'Arial',
      text: "All mhe world's a smage, and all mhe men and women merely players.",
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    var trace = layer.getContext().getTrace();
    assert.equal(trace.indexOf('NaN') === -1, true, 'No NaNs');
  });

  // ======================================================
  it('Check getter and setter', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M 50 50 l 250 0';
    var path = new Konva.TextPath({
      text: 'some text',
      stroke: 'red',
      strokeWidth: 1,
    });

    layer.add(path);
    stage.add(layer);

    assert.equal(path.data(), undefined);
    path.data(c);
    assert.equal(path.data(), c);

    layer.draw();
  });

  // ======================================================
  it('Render Text Along Vertical Line', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    // Top Down
    var c = 'M 50,10 50,150';

    var path = new Konva.Path({
      stroke: 'red',
      strokeWidth: 1,
      data: c,
    });

    layer.add(path);

    var textpath = new Konva.TextPath({
      stroke: 'black',
      strokeWidth: 1,
      fill: 'orange',
      fontSize: 18,
      fontFamily: 'Arial',
      text: "The quick brown fox jumped over the lazy dog's back",
      data: c,
    });

    layer.add(textpath);

    // Bottom up
    c = 'M 150,150 150,10';

    path = new Konva.Path({
      stroke: 'red',
      strokeWidth: 1,
      data: c,
    });

    layer.add(path);

    textpath = new Konva.TextPath({
      stroke: 'black',
      strokeWidth: 1,
      fill: 'orange',
      fontSize: 18,
      fontFamily: 'Arial',
      text: "The quick brown fox jumped over the lazy dog's back",
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();restore();restore();'
    );
  });

  // ======================================================
  it('Render Text Along two connected Bezier', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 C0,0 10,150 100,100 S300,150 400,50';
    var path = new Konva.Path({
      stroke: 'red',
      strokeWidth: 1,
      data: c,
    });

    layer.add(path);

    var textpath = new Konva.TextPath({
      stroke: 'black',
      strokeWidth: 1,
      fill: 'orange',
      fontSize: 8,
      fontFamily: 'Arial',
      text: "All the world's a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.",
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();restore();restore();'
    );
  });

  // ======================================================
  it('Render Text Along Elliptical Arc', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M 250,100 A 100 50 30 1 0 150 150';
    var path = new Konva.Path({
      stroke: 'red',
      strokeWidth: 1,
      data: c,
    });

    layer.add(path);

    var textpath = new Konva.TextPath({
      fill: 'black',
      fontSize: 10,
      text: "All the world's a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.",
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();'
    );
  });

  // ======================================================
  it('Render Text Along complex path', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c =
      'M 955.92249,-42.126952 L 955.92249,-42.126952 L 955.92249,-42.126952 L 961.93262,212.9279 C 961.72797,213.3372 961.22315,215.2234 960.80572,215.5574 C 957.45077,218.2413 956.9054,218.3026 953.66869,216.6843 C 952.62164,216.1607 951.67338,214.3658 949.91236,214.8061 C 947.3405,215.4491 948.09281,215.8744 946.53166,217.4355 C 945.22315,218.744 943.52659,219.8744 943.52659,222.3188 C 943.52659,225.6087 944.62943,224.7909 946.15603,226.8264 C 947.55965,228.6979 948.18154,229.6696 948.78546,232.0852 C 949.37174,234.4304 951.2918,235.2197 952.16616,236.9685 C 953.11809,238.8723 956.44837,240.9001 955.17122,242.6029 C 955.17122,242.8772 955.27602,243.9657 955.17122,244.1055 C 954.37248,245.1705 952.25782,247.1195 951.79052,248.9887 C 951.25154,251.1447 951.97226,252.3937 951.41489,254.6232 C 950.9178,256.6116 949.53672,257.6472 949.53672,259.8821 C 949.53672,261.2894 949.87203,263.5578 950.66362,265.1409 C 951.32462,266.4629 953.24159,268.3158 953.66869,270.0242 C 954.03114,271.474 954.12634,273.8281 953.66869,275.6587 C 953.20033,277.5321 952.16616,278.7427 952.16616,280.9175 C 952.16616,281.7694 952.66216,286.9313 952.16616,287.3033 C 950.55129,287.3033 950.38215,287.5144 949.16109,288.4302 C 947.74898,289.4893 945.57047,291.4095 944.65349,292.9378 C 943.57061,294.7426 942.86906,296.6011 942.3997,298.9479 C 941.97063,301.0933 941.32659,303.0261 940.1459,304.2068 C 938.60102,305.7517 939.019,307.4128 939.019,309.8413 C 939.019,311.6467 939.44296,314.3005 938.26773,315.4758 C 937.15545,316.5881 934.88703,318.5361 934.88703,320.7346 C 934.88703,322.7058 934.79432,324.8714 935.26267,326.7448 C 935.72373,328.589 935.6383,330.6902 935.6383,332.7549 C 935.6383,334.5937 936.08895,337.1125 935.26267,338.765 C 933.38787,342.5146 935.26267,342.5858 935.26267,345.5264 C 935.61053,346.9179 935.6383,348.2383 935.6383,350.034 C 935.6383,351.5752 934.96036,354.5783 932.63323,353.4147 C 932.09123,353.1437 928.92886,348.8032 927.75,351.1609 C 926.64231,353.3763 926.87972,354.3829 928.12564,356.0442 C 929.10471,357.3496 930.01787,360.3569 928.12564,361.303 C 926.67006,362.0308 924.24963,362.5828 924.74494,365.0593 C 925.21304,367.3998 926.19847,367.8684 926.6231,369.567 C 926.7781,370.1869 927.80544,374.5783 926.24747,375.2014 C 924.2456,376.0022 920.63857,376.64 919.86171,378.5821 C 918.7844,381.2754 918.89909,381.8572 921.36424,383.0897 C 922.93947,383.8774 923.65296,384.6272 925.12057,386.0948 C 925.4026,386.3768 928.41848,391.3951 926.99874,392.1049 C 926.6231,392.2301 926.22599,392.3035 925.87184,392.4806 C 924.02717,393.4029 922.07311,394.7556 920.61297,395.4856 C 918.19436,396.6949 919.66034,398.0609 920.23734,400.3689 C 920.66358,402.0738 920.9143,404.1809 919.48607,405.2521 C 918.27148,406.163 916.40598,407.9567 914.60284,407.5059 C 912.7458,407.0416 911.06841,406.8699 909.71961,407.8815 C 908.08698,409.106 906.39997,410.6424 905.96328,412.3891 C 905.46424,414.3853 903.5041,416.8116 901.83132,417.648 C 900.14443,418.4914 897.73682,419.2163 895.82119,420.6531 C 894.39644,421.7216 891.99114,423.3808 890.93796,424.785 C 889.59804,426.5716 888.40557,428.0687 886.80599,429.6682 C 885.18365,431.2906 883.35936,432.8052 882.29839,434.9271 C 881.56876,436.3864 879.95545,436.9836 879.29333,438.3078 C 878.57656,439.7413 877.73542,441.3406 876.28826,442.0641 C 874.75553,442.8305 873.35007,443.456 871.40503,443.9423 C 867.75936,444.8537 869.30342,446.1864 868.7756,448.8255 C 868.7756,449.4008 868.88599,450.1518 868.7756,450.7037 C 868.4147,452.5082 867.97176,454.46 866.14617,454.46 C 863.87643,454.46 863.13519,452.5202 860.51167,452.9575 C 858.30041,453.326 855.7288,453.4708 853.75028,454.46 C 851.66578,455.5023 850.88183,456.6114 849.24268,457.8407 C 848.34172,458.5165 844.59521,461.2214 842.85692,461.2214 C 841.06194,461.2214 838.75283,461.625 837.59805,460.4702 C 836.02546,458.8976 834.59299,457.0331 834.59299,454.8357 C 834.59299,452.5753 834.44046,450.9268 833.09045,449.5768 C 831.22582,447.7122 830.88608,448.6344 829.33412,450.7037 C 827.57516,453.049 826.50225,455.876 824.07526,457.0895 C 820.97109,458.6416 819.33963,458.3772 818.44076,461.9727 C 817.87317,464.2431 816.93823,466.7246 816.93823,469.1097 C 816.93823,470.8675 817.70296,474.7173 816.93823,476.2468 C 816.14706,477.8291 812.41394,478.9791 810.9281,476.998 C 808.83845,474.2118 810.41749,473.2417 805.66924,473.2417 C 801.6473,473.2417 799.28347,473.0146 799.28347,477.3737 C 799.28347,479.1155 799.58784,484.5107 796.65404,484.5107 C 796.27841,484.5107 795.90277,484.5107 795.52714,484.5107 C 793.06311,484.5107 790.57051,484.2819 789.51701,486.3889 C 789.24153,486.9398 789.17021,490.492 788.39011,491.2721 C 785.76325,493.8989 789.66759,493.7526 790.26828,496.1553 C 790.57092,497.3659 791.29959,501.1341 790.26828,502.1654 C 788.37505,504.0587 788.1443,505.2726 787.63885,507.7999 C 787.12622,510.3631 787.28641,510.4294 784.25815,510.4294 C 779.52049,510.4294 778.62062,512.1783 781.25308,515.6882 C 782.04773,516.7478 784.15693,519.0183 785.76068,519.8202 C 787.2339,520.5568 788.2453,521.5264 787.63885,523.9522 C 787.29534,525.3262 785.38505,526.8783 785.38505,528.8354 C 785.38505,532.3304 785.96541,532.0452 787.63885,533.7186 C 789.35939,535.4392 791.26358,536.4988 790.64391,538.9775 C 790.07532,541.2518 787.846,540.5966 785.38505,540.1044 C 784.8577,539.9989 777.87238,538.1167 777.87238,538.2262 C 777.87238,538.3043 777.87238,541.4667 777.87238,543.1095 C 777.87238,545.7389 776.11001,547.6978 773.74042,549.1196 C 769.72179,551.5308 769.56137,548.92 765.85212,547.9927 C 764.43987,547.6396 762.84706,547.0925 762.84706,544.9876 C 762.84706,542.5025 764.72522,540.5566 764.72522,538.9775 C 764.72522,537.481 764.49962,535.4457 763.97396,533.343 C 763.53464,531.5857 763.96677,529.2128 760.96889,529.9623 C 759.74476,530.2683 755.76059,530.9158 755.3344,529.211 C 754.79258,527.0438 753.83472,525.0819 752.32933,523.5765 C 751.7239,522.9711 748.78535,518.481 747.07047,520.1958 C 745.42956,521.8367 745.1923,522.8794 745.1923,525.4547 C 745.1923,529.5231 743.80555,527.5927 741.43597,529.9623 C 739.21241,532.1859 738.84328,532.0691 738.05527,535.2212 C 737.62578,536.9391 737.33255,538.9489 736.17711,540.1044 C 735.37222,540.9093 731.5352,542.6268 730.91824,543.8607 C 729.89113,545.9149 730.31425,546.7847 731.29388,548.744 C 731.93347,550.0231 732.94949,551.8879 732.42078,554.0028 C 731.86797,556.214 729.92914,558.5699 727.16191,559.2617 C 726.16187,559.7617 724.82639,560.5029 723.78121,560.7642 C 721.91594,561.2305 719.64925,561.351 719.64925,564.1449 C 719.64925,566.832 719.04019,568.7236 721.15178,569.7794 C 722.21289,570.31 724.72561,571.2926 725.28375,572.4088 C 726.18968,574.2207 726.03501,576.214 726.03501,578.419 C 726.03501,580.9518 724.90811,582.9761 724.90811,585.1804 C 724.90811,587.587 724.17206,589.3326 725.28375,590.8149 C 726.38582,592.2843 727.68532,592.9085 728.28881,595.3225 C 728.47077,596.0503 729.29883,599.6882 728.66444,600.957 C 728.20299,601.8799 726.62388,604.7133 724.90811,604.7133 C 722.23081,604.7133 719.55156,603.2108 717.77108,603.2108 C 712.9722,603.2108 711.01958,602.0443 709.88279,606.5915 C 709.52114,608.038 708.85871,610.3121 708.38026,612.2259 C 707.78279,614.6158 706.87772,616.6877 706.87772,619.363 C 706.87772,621.8398 706.7087,624.1711 706.12646,626.5 C 705.78303,627.8737 704.58011,630.6495 702.74576,631.3832 C 700.14612,632.4231 699.90837,632.6269 696.73563,633.2614 C 695.19072,633.5704 692.38471,634.0127 690.34987,634.0127 C 687.92024,634.0127 684.24023,633.3112 682.08594,634.3883 C 680.51621,635.1732 677.63742,637.5327 677.20271,639.2715 C 676.32889,642.7668 669.65019,641.1298 666.68498,639.6472 C 665.51347,639.0614 662.57658,637.112 662.17738,635.5152 C 661.57521,633.1065 663.16351,629.2235 662.17738,627.2513 C 661.26634,625.4292 659.87344,623.4448 658.42105,621.9924 C 657.38134,620.9527 655.38855,620.0777 654.28908,618.6117 C 653.089,617.0116 651.62053,616.0553 650.15712,614.1041 C 648.34003,611.6813 647.12666,612.2259 643.77136,612.2259 C 639.94754,612.2259 634.27092,612.8011 630.99983,610.3478 C 628.83169,608.7217 627.09631,607.7996 625.74097,605.0889 C 624.63961,602.8862 624.51407,601.3082 623.8628,598.7032 C 623.8628,597.1031 624.2465,594.9791 623.8628,593.4443 C 623.39918,591.5898 621.23337,589.3243 621.23337,587.4342 C 621.23337,587.1837 621.29411,586.9258 621.23337,586.6829 C 620.53685,583.8968 622.36027,582.4393 622.36027,580.6728 C 622.36027,578.1478 621.87342,577.1809 620.10647,575.4139 C 619.11396,574.4214 614.71345,572.543 612.96944,574.287 C 611.60526,575.6512 609.17921,577.309 606.95931,578.419 C 604.01326,579.892 598.66588,576.9755 597.19285,579.9215 C 596.40756,581.4921 595.76926,583.6587 595.31468,585.9316 C 594.88705,588.0698 594.09657,589.556 591.55835,590.0636 C 590.26591,590.3221 585.80562,591.0513 585.17259,592.3174 C 584.45323,593.7561 582.33804,595.3917 581.79189,597.5763 C 581.21425,599.8868 580.53762,600.7708 578.78683,602.0839 C 576.60544,603.7199 574.24457,604.0233 571.27416,602.8351 C 569.56134,602.15 566.96195,601.3583 564.51277,601.7082 C 562.15094,602.0456 560.7219,604.7047 559.2539,604.3377 C 556.608,603.6762 556.41629,603.5592 554.74631,601.3326 C 553.7801,600.0443 552.83677,595.5353 551.36561,594.9468 C 549.22437,594.0903 546.63624,594.001 543.85294,593.4443 C 541.39906,592.9535 538.87331,593.0687 536.34028,593.0687 C 532.49916,593.0687 532.93906,592.2969 530.70579,590.0636 C 529.57858,588.9364 527.94151,588.118 525.82255,587.0585 C 523.85495,586.0747 523.02163,585.6928 520.56369,586.3073 C 518.15725,586.9089 517.4765,588.4877 515.68046,588.9367 C 514.53264,589.2237 511.38458,588.643 510.04596,589.3123 C 508.49749,590.0866 507.19267,590.5834 506.66527,592.693 C 506.20828,594.521 505.99947,595.9598 504.7871,597.5763 C 503.10137,599.8239 501.43481,599.4686 499.1526,598.3275 C 496.74377,597.1231 496.63249,597.7484 493.89374,597.2006 C 491.45635,596.7131 490.45647,596.313 488.63487,594.9468 C 486.20245,593.1225 485.84728,591.7342 484.87854,589.3123 C 484.34805,587.9861 483.82138,584.0535 482.24911,584.0535 C 479.1858,584.0535 478.32694,584.2633 476.23898,582.1753 C 475.01433,580.9507 474.104,579.7043 472.85828,578.0433 C 471.87387,576.7308 471.15841,575.0383 468.72632,575.0383 C 465.62648,575.0383 465.0931,574.4101 463.09182,572.4088 C 461.80618,571.1232 459.77548,570.155 457.45733,570.155 C 454.22738,570.155 453.13567,570.2034 450.69593,572.0332 C 449.01793,573.2917 445.74427,574.287 443.5589,574.287 C 441.14907,574.287 438.88122,574.5776 436.7975,573.5357 C 435.27776,572.7759 434.01441,571.5961 432.28991,570.9063 C 429.9965,569.989 427.79078,568.6525 425.15288,568.6525 C 423.40022,568.6525 419.8328,569.7488 418.39148,569.0281 C 418.14106,568.9029 417.89064,568.7777 417.64021,568.6525 C 415.49479,567.5798 416.55622,567.2358 415.38641,564.8962 C 414.77237,563.6681 414.63515,562.1788 414.63515,560.0129 C 414.63515,558.3145 415.04465,556.0165 414.63515,554.3784 C 414.06491,552.0975 414.24886,549.8602 412.38135,547.9927 C 411.40995,547.0213 409.24156,545.0938 408.62502,543.8607 C 408.07318,542.757 407.08617,540.8193 405.99559,539.7288 C 404.23882,537.972 404.86869,537.4962 404.86869,535.2212 C 404.86869,532.3223 402.92378,530.8222 402.23926,528.0841 C 402.03511,527.2676 400.20775,523.9522 399.23419,523.9522 C 397.40724,523.9522 395.17436,524.3278 393.59969,524.3278 C 392.1471,524.3278 388.62445,524.895 387.9652,523.5765 C 387.16017,521.9665 386.46266,520.8647 386.46266,518.3177 C 386.46266,517.2392 387.06995,513.4929 386.46266,512.6832 C 385.44124,511.3213 383.94518,508.9268 382.3307,508.9268 C 380.0442,508.9268 378.68472,509.6505 377.07184,510.0537 C 374.43842,510.7121 375.12089,510.9506 374.06677,513.0588 C 372.99551,515.2013 371.43568,515.6866 369.55917,513.8101 C 367.11608,511.367 367.54854,511.9833 366.17847,513.8101 C 364.4331,516.1372 362.02692,517.942 359.04145,517.942 C 356.27733,517.942 354.79253,517.3325 353.78258,515.3126 C 352.71976,513.187 352.20547,512.3075 349.65062,512.3075 C 347.43943,512.3075 345.67638,511.8115 345.14302,509.6781 C 344.69437,507.8835 343.8574,505.0515 342.51359,504.0436 C 341.49931,503.2829 339.32282,500.99 337.25472,502.5411 C 336.12724,503.3867 330.59067,511.5766 329.49596,511.5766 L 339.92116,9.4291543 L 531.3294,9.5579943 C 531.53498,9.8775343 531.74056,10.197084 531.94614,10.516624 C 532.70213,11.691684 530.89998,12.894794 530.62953,14.247024 C 530.42067,15.291354 532.94855,14.371684 533.70163,15.124764 C 533.96143,15.384574 533.06188,17.795104 533.26276,18.196854 C 533.6241,18.919554 537.09651,16.118584 537.43203,15.783074 C 538.52925,14.685844 541.26067,15.533334 542.2596,15.783074 C 544.36225,16.308734 544.53484,13.969904 545.77057,16.441374 C 546.72008,18.340404 548.8757,18.577754 550.81758,18.855164 C 551.5334,18.957424 552.36959,15.108804 552.7925,14.685894 C 553.70371,13.774684 554.04733,13.026284 554.76742,14.466454 C 555.55609,16.043794 556.96728,16.885754 558.27838,18.196854 C 559.14892,19.067394 560.36843,19.874104 561.35048,20.610644 C 562.42985,21.420174 563.12715,21.998014 564.20314,22.805004 C 565.9662,24.127294 567.78898,25.511804 570.12789,26.096534 C 572.7652,26.755854 576.55367,27.553934 578.90531,28.729754 C 580.9132,29.733704 583.43718,29.459644 585.48837,30.485234 C 586.49144,30.986774 588.94826,31.133324 590.09651,31.362974 C 591.42028,32.024864 591.77294,34.338314 592.07143,35.532254 C 592.3559,36.670124 593.11993,38.320014 593.82691,39.262654 C 594.69143,40.415344 596.17315,41.423224 597.11844,41.895874 C 598.26675,42.470034 600.11464,43.649294 601.28771,44.529104 C 602.4452,45.397214 603.546,45.151114 603.04319,47.162324 C 602.73764,48.384554 601.38101,48.605074 600.62941,49.356674 C 599.50817,50.477904 599.93932,51.519254 600.84884,52.428774 C 601.81016,53.390084 603.26382,53.305314 604.14037,52.428774 C 604.62824,51.940894 608.18038,52.428774 608.96795,52.428774 C 611.1468,52.428774 610.66216,51.127474 612.47891,50.673284 C 612.63759,50.633624 612.77149,50.526994 612.91778,50.453854 C 614.68717,49.569154 616.9206,51.445064 617.9648,49.356674 C 618.52936,48.227544 619.56541,48.220674 619.93972,46.723454 C 620.25133,45.477014 620.37729,44.531694 621.03689,43.212484 C 621.76915,41.747964 621.9135,40.434484 622.79237,39.262654 C 623.77356,37.954414 624.27391,36.972204 625.64503,36.629424 C 627.98413,36.044654 628.95445,36.884634 629.81431,38.604344 C 630.5868,40.149334 629.04661,41.566394 628.05882,42.554184 C 627.03053,43.582464 626.94563,46.049134 627.83939,46.942884 C 628.71859,47.822094 631.7203,46.960114 632.66697,46.723454 C 635.14429,46.104124 638.40825,46.723454 641.00551,46.723454 C 642.99376,46.723454 643.25279,47.744904 644.29704,49.137244 C 645.27121,50.436134 645.05681,51.584644 643.63873,52.648204 C 642.199,53.728004 640.62809,54.372964 639.25003,55.061994 C 637.13418,56.119914 635.43133,55.127564 633.54471,54.184254 C 631.95211,53.387954 630.44161,53.389994 628.71713,53.964814 C 626.84122,54.590124 627.42091,55.720304 625.20616,55.720304 C 623.21044,55.720304 622.67528,55.410144 621.25633,54.842564 C 619.91862,54.307474 619.00883,54.278974 617.9648,55.061994 C 617.10854,55.704184 616.39298,55.720304 614.8927,55.720304 C 613.05499,55.720304 612.78965,55.409564 611.82061,56.378604 C 611.11873,57.080484 611.94664,57.914654 609.40682,57.914654 C 607.90864,57.914654 607.56008,59.135134 606.55416,59.889574 C 605.2063,60.900474 602.08634,60.328444 600.40997,60.328444 C 598.82692,60.328444 597.23216,60.282954 596.02126,60.767314 C 592.93299,62.002624 597.05347,63.219724 597.77675,63.400534 C 599.71594,63.885334 600.39327,64.211484 600.84884,66.033764 C 601.33813,67.990904 602.14535,68.474354 603.48206,66.692064 C 604.91144,64.786234 602.91352,64.497714 606.77359,64.497714 C 607.59464,64.497714 608.63043,67.232284 608.96795,67.569814 C 610.45793,69.059794 611.16665,70.095494 613.13722,71.080774 C 614.46498,71.744654 616.30615,67.595574 616.64819,66.911504 C 617.28296,65.641964 617.99069,64.704204 619.28141,64.058844 C 621.30547,63.046814 622.75619,64.278284 624.76729,64.278284 C 626.50942,64.278284 627.61995,65.003454 627.61995,62.742234 C 627.61995,61.212584 627.63406,61.199134 628.93656,60.547884 C 628.93656,59.039954 631.8995,61.398604 633.10584,62.303364 C 634.22905,63.145774 635.25806,64.560214 636.6168,65.375454 C 638.02819,66.222284 639.45789,65.179164 639.90833,64.278284 C 640.50672,63.081494 642.69629,63.368184 643.63873,63.839414 C 644.9694,64.504744 646.71554,64.500074 648.02744,65.156024 C 649.65658,65.970594 651.25018,66.091894 652.63558,67.130944 C 654.5709,68.582434 655.72441,69.284754 658.12146,69.764164 C 660.76933,70.293734 662.17378,70.473704 664.26565,71.519644 C 666.22906,72.501344 668.08427,73.121854 669.75154,74.372304 C 670.99777,75.306984 673.61008,75.688914 675.23742,75.688914 C 678.09495,75.688914 679.5978,74.715624 682.03992,73.494564 C 683.61178,72.708634 685.09563,72.194334 686.20919,71.080774 C 687.25214,70.037824 688.09533,68.975204 689.28128,67.789244 C 690.81968,66.250844 691.90496,66.472634 694.10886,66.472634 C 695.98476,66.472634 697.61589,67.130944 699.37531,67.130944 C 700.88236,67.130944 702.30921,68.008684 703.98345,68.008684 C 705.78815,68.008684 706.82154,67.443974 708.15272,66.911504 C 709.49084,66.376254 710.32631,65.391024 711.22482,64.717154 C 712.93357,63.435584 713.93405,62.155634 715.83296,61.206184 C 717.44839,60.398474 719.60451,59.255264 721.09941,58.134094 C 722.32027,57.218444 724.55866,55.842944 725.92699,55.500864 C 727.42616,55.126074 729.09302,54.102794 730.53513,53.525944 C 732.4374,52.765044 734.47148,52.545224 736.02101,51.770464 C 736.81463,51.373654 738.38579,51.112164 739.31254,51.112164 C 739.58229,50.977294 739.8977,50.965874 740.19028,50.892724 C 741.93619,50.456234 744.97275,50.145724 746.55391,51.331594 C 747.77567,52.247914 749.08929,52.550364 750.06487,53.525944 C 751.05366,54.514734 751.10636,54.963084 752.6981,55.281434 C 753.97746,55.537304 755.20688,54.403694 756.64793,54.403694 C 757.60799,54.403694 759.65763,56.143574 760.59777,56.378604 C 762.10547,56.755534 763.41059,56.817474 764.98648,56.817474 C 766.46659,56.817474 768.85254,54.943624 770.47236,54.403694 C 772.25575,53.809224 773.23113,53.525944 775.29994,53.525944 C 777.348,53.525944 779.39606,53.525944 781.44413,53.525944 C 783.12504,53.525944 784.01926,53.375894 785.17453,53.087074 C 786.13177,52.847764 786.81429,52.867644 787.80775,52.867644 C 789.68721,52.397784 790.54366,51.799654 792.41589,51.331594 C 793.72507,51.004304 794.52824,48.862394 795.04912,47.820634 C 795.74654,46.425784 796.31421,45.768114 797.24347,44.529104 C 798.0814,43.411864 799.90954,42.318324 801.19331,41.676444 C 802.47959,41.033304 803.007,40.301614 804.04597,39.262654 C 804.9791,38.329524 805.42163,37.448114 806.24032,36.629424 C 807.32555,35.544194 808.33509,33.723304 809.09298,32.460154 C 809.72369,31.408974 811.13754,30.635024 812.16508,29.607494 C 812.75994,29.012634 816.59236,28.500674 817.43152,28.290884 C 818.9728,27.905564 820.03772,26.864014 820.94249,25.657664 C 821.81326,24.496634 822.20664,23.673144 822.47854,22.585564 C 822.70979,21.660554 823.16846,20.484194 823.35628,19.732904 C 823.39176,19.590984 823.35628,19.440324 823.35628,19.294034 C 824.72829,14.181234 833.5556,11.720324 838.16552,9.4153643 C 840.3455,8.3253643 841.62867,5.2222343 843.25846,3.0491743 C 844.34873,1.5954943 847.99376,1.4409443 850.04906,0.92711429 C 853.15105,0.15161429 855.95039,-0.84630571 858.11289,-2.4681757 C 860.2827,-4.0955457 863.83523,-5.3512957 866.17672,-6.2878857 C 868.93603,-7.3916157 871.61677,-9.3068957 873.81614,-10.956426 C 875.97519,-12.575706 878.16034,-13.552932 880.60673,-14.776132 C 882.92916,-15.937342 883.77331,-17.477632 886.5485,-18.171422 C 890.51751,-19.163682 894.57232,-17.476362 898.43204,-19.020252 C 901.2465,-20.146032 904.60721,-21.731172 907.3447,-22.415552 C 909.30842,-22.906482 911.47245,-25.328252 913.28647,-26.235262 C 916.00359,-27.593822 917.08159,-29.412202 919.65265,-30.054972 C 921.32298,-30.472552 924.26602,-31.730552 926.44325,-32.601442 C 928.89479,-33.582062 931.86421,-33.402072 933.65826,-34.299092 C 936.16619,-35.553052 937.08458,-36.322802 939.17561,-36.845562 C 941.67817,-37.471202 944.13749,-38.007702 946.81503,-38.543212 C 948.94134,-38.968472 950.98649,-40.592612 952.33239,-41.938512 C 953.1616,-42.767712 955.07166,-42.233042 955.92249,-42.126952 z ';

    var textpath = new Konva.TextPath({
      y: 50,
      fill: 'black',
      fontSize: 24,
      text: Array(4).join(
        "All the world's a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts."
      ),
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();'
    );
  });

  // ======================================================
  it('Render Text Along complex path cached', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 C0,0 10,150 100,100 S300,150 400,50';

    var textpath = new Konva.TextPath({
      stroke: 'black',
      strokeWidth: 1,
      fill: 'orange',
      fontSize: 10,
      fontFamily: 'Arial',
      text: "All the world's a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.",
      data: c,
      draggable: true,
    });

    textpath.cache();

    layer.add(textpath);
    stage.add(layer);

    cloneAndCompareLayer(layer, 200);
  });

  it('Text path with letter spacing', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 C0,0 10,150 100,100 S300,150 400,50';

    var textpath = new Konva.TextPath({
      stroke: 'black',
      strokeWidth: 1,
      fill: 'orange',
      fontSize: 10,
      fontFamily: 'Arial',
      letterSpacing: 5,
      text: "All the world's a stage, and all the men and women merely players.",
      data: c,
    });

    textpath.cache();

    layer.add(textpath);
    stage.add(layer);
    cloneAndCompareLayer(layer, 200, 30);
  });

  it('Text path with align', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 300, 10';

    var textpath = new Konva.TextPath({
      fill: 'black',
      fontSize: 10,
      fontFamily: 'Arial',
      letterSpacing: 5,
      text: "All the world's a stage.",
      align: 'center',
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    var trace =
      'restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();';

    assert.equal(layer.getContext().getTrace(true), trace);
  });

  it('Text path with emoji', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 300, 10';

    var textpath = new Konva.TextPath({
      fill: 'black',
      fontSize: 10,
      fontFamily: 'Arial',
      letterSpacing: 5,
      text: '😬',
      align: 'center',
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'clearRect();save();transform();font;textBaseline;textAlign;save();save();translate();rotate();fillStyle;fillText();restore();restore();restore();'
    );
  });

  it('Text path with center align - arc', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var textpath = new Konva.TextPath({
      fill: '#333',
      fontSize: 20,
      text: 'Hello  World',
      align: 'right',
      data: 'M 50 200 a 100 100 0 0 1 200 0',
    });
    layer.add(textpath);

    var path = new Konva.Path({
      stroke: '#000',
      data: 'M 50 200 a 100 100 0 0 1 200 0',
    });
    layer.add(path);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'clearRect();save();transform();font;textBaseline;textAlign;save();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();save();transform();beginPath();moveTo();translate();rotate();scale();arc();scale();rotate();translate();lineWidth;strokeStyle;stroke();restore();'
    );
  });

  it('Text path with align right', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 300, 10';

    var path = new Konva.Path({
      stroke: 'red',
      data: c,
    });

    layer.add(path);

    var textpath = new Konva.TextPath({
      fill: 'black',
      fontSize: 10,
      fontFamily: 'Arial',
      text: "All the world's a stage.",
      align: 'right',
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();'
    );
  });

  it('Text path with justify align', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 C0,0 10,150 100,100 S300,150 400,50';

    var textpath = new Konva.TextPath({
      stroke: 'black',
      strokeWidth: 1,
      fill: 'orange',
      fontSize: 10,
      fontFamily: 'Arial',
      letterSpacing: 5,
      text: 'All the worlds a stage.',
      align: 'justify',
      data: c,
    });

    layer.add(textpath);
    stage.add(layer);

    var trace =
      'rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();save();translate();rotate();fillStyle;fillText();lineWidth;strokeStyle;strokeText();restore();restore();restore();';

    assert.equal(layer.getContext().getTrace(true), trace);
  });

  it('Text path with underline', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M10,10 C0,0 10,150 100,100 S300,150 400,50';

    var textpath = new Konva.TextPath({
      fill: 'orange',
      fontSize: 10,
      fontFamily: 'Arial',
      letterSpacing: 5,
      text: 'All the worlds a stage.',
      textDecoration: 'underline',
      data: c,
      draggable: true,
    });

    layer.add(textpath);
    stage.add(layer);

    var trace =
      'rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();save();translate();rotate();fillStyle;fillText();lineTo();restore();stroke();restore();restore();';

    assert.equal(layer.getContext().getTrace(true), trace);
  });

  it('Text with baseline', function () {
    var stage = addStage();
    var layer = new Konva.Layer();

    var c = 'M 10,10 300,10';

    var path = new Konva.Path({
      stroke: 'red',
      strokeWidth: 1,
      data: c,
    });

    layer.add(path);

    var textpath = new Konva.TextPath({
      fill: 'orange',
      fontSize: 24,
      fontFamily: 'Arial',
      text: "The quick brown fox jumped over the lazy dog's back",
      data: c,
      textBaseline: 'top',
    });
    textpath.on('mouseover', function () {
      this.fill('blue');
      layer.drawScene();
    });
    textpath.on('mouseout', function () {
      this.fill('orange');
      layer.drawScene();
    });

    layer.add(textpath);
    stage.add(layer);

    assert.equal(
      layer.getContext().getTrace(true),
      'restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();'
    );
  });

  it('Text with kerning', function () {
    var stage = addStage();

    // simulate lack of kerning support
    stage.content && (stage.container().style.fontKerning = 'none');

    var layer = new Konva.Layer();
    var pairs = {
      A: {
        V: -0.07421875,
      },
      V: {
        A: -0.07421875,
      },
    };

    const kernedText = new Konva.TextPath({
      x: 0,
      y: 30,
      fill: 'black',
      text: 'AV',
      fontSize: 60,
      data: 'M0,0 L200,0',
      kerningFunc: function (leftChar, rightChar) {
        return pairs.hasOwnProperty(leftChar)
          ? pairs[leftChar][rightChar] || 0
          : 0;
      },
    });

    const unkernedText = new Konva.TextPath({
      x: 0,
      y: 90,
      fill: 'black',
      text: 'AV',
      fontSize: 60,
      data: 'M0,0 L200,0',
    });

    layer.add(kernedText);
    layer.add(unkernedText);
    stage.add(layer);

    assert(
      kernedText.getTextWidth() < unkernedText.getTextWidth(),
      'kerned text lenght must be less then unkerned text length'
    );
  });

  it('Text with invalid kerning getter should not fail (fallback to unkerned)', function () {
    var stage = addStage();

    // simulate lack of kerning support
    stage.content && (stage.container().style.fontKerning = 'none');

    var layer = new Konva.Layer();

    const kernedText = new Konva.TextPath({
      x: 0,
      y: 30,
      fill: 'black',
      text: 'AV',
      fontSize: 60,
      data: 'M0,0 L200,0',
      kerningFunc: function (leftChar, rightChar) {
        // getter that fails
        throw new Error('something went wrong');
      },
    });

    const unkernedText = new Konva.TextPath({
      x: 0,
      y: 90,
      fill: 'black',
      text: 'AV',
      fontSize: 60,
      data: 'M0,0 L200,0',
    });

    layer.add(kernedText);
    layer.add(unkernedText);
    stage.add(layer);

    assert.equal(
      kernedText.getTextWidth(),
      unkernedText.getTextWidth(),
      'should gracefully fallback to unkerned text'
    );
  });

  it('can set kerning after initialization', function () {
    var stage = addStage();

    // simulate lack of kerning support
    stage.content && (stage.container().style.fontKerning = 'none');

    var layer = new Konva.Layer();
    stage.add(layer);

    const kernedText = new Konva.TextPath({
      x: 0,
      y: 30,
      fill: 'black',
      text: 'AV',
      fontSize: 60,
      data: 'M0,0 L200,0',
    });
    layer.add(kernedText);
    layer.draw();

    var called = false;
    kernedText.kerningFunc(function () {
      called = true;
      return 1;
    });

    layer.draw();
    assert.equal(called, true);
  });

  it.skip('linear gradient for path', function () {
    var stage = addStage();

    var layer = new Konva.Layer();
    stage.add(layer);

    const text = new Konva.TextPath({
      x: 0,
      y: 30,
      fontSize: 20,
      data: 'M0,0 L200,0',
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 200, y: 0 },
      fillLinearGradientColorStops: [0, 'yellow', 1, 'red'],
      text: 'Text with gradient!!',
    });
    layer.add(text);
    layer.draw();
  });

  it('visual check for text path', function () {
    var stage = addStage();

    var layer = new Konva.Layer();
    stage.add(layer);

    layer.add(
      new Konva.TextPath({
        fill: '#333',
        fontSize: 20,
        x: 80,
        y: 300,
        fontFamily: 'Calibri',
        text: 'Hello World',
        align: 'center',
        textBaseline: 'bottom',
        data: 'M -80.34441853748636 -247.27469423673992 A 260 260 0 0 1 80.34441853748628 -247.27469423673995',
      })
    );

    layer.add(
      new Konva.TextPath({
        fill: '#333',
        fontSize: 20,
        x: 80,
        y: 350,
        fontFamily: 'Calibri',
        text: 'Hello World',
        align: 'center',
        // textBaseline: 'bottom',
        data: 'M -80.34441853748636 -247.27469423673992 A 260 260 0 0 1 80.34441853748628 -247.27469423673995',
      })
    );

    layer.add(
      new Konva.Text({
        text: 'Hello world',
      })
    );

    layer.add(
      new Konva.TextPath({
        fill: '#333',
        text: 'Hello world',
        y: 20,
        data: 'M 0 0 L100 0',
      })
    );
    layer.draw();

    assert.equal(
      layer.getContext().getTrace(true),
      'save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();save();transform();font;textBaseline;textAlign;translate();save();fillStyle;fillText();restore();restore();save();transform();font;textBaseline;textAlign;save();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();save();translate();rotate();fillStyle;fillText();restore();restore();restore();'
    );
  });

  it('client rect calculations', function () {
    var stage = addStage();

    var layer = new Konva.Layer();
    stage.add(layer);

    var textpath = new Konva.TextPath({
      x: 100,
      y: 150,
      fill: '#333',
      fontSize: 16,
      fontFamily: 'Arial',
      align: 'right',
      text: 'test_path',
      data: 'M 0,10 L 300 10',
    });
    layer.add(textpath);
    layer.draw();

    var rect = textpath.getClientRect();

    assert.equal(rect.height, 16, 'check height');

    textpath.text('');
    rect = textpath.getClientRect();
    assert.equal(rect.height, 0, 'check height');
  });

  it('check bad calculations', function () {
    var stage = addStage();
    stage.draggable(true);

    var layer = new Konva.Layer();
    stage.add(layer);

    var textpath = new Konva.TextPath({
      fill: '#333',
      fontSize: 16,
      scaleX: 0.8,
      scaleY: 0.8,
      text: '__________________________________________________________________________________________________________________________________________________________________________________________________________________',
      data: 'M 109.98618090452261 138.6656132223618 C 135.94577638190955 48.80547503140701 149.91187876884422 79.79800957914573 151.40954773869348 117.23973382537689 S 123.00811620603017 419.616741991206 122.84170854271358 460.0538041771357 S 134.33883542713568 469.8304329459799 149.98115577889448 464.33898005653265 S 245.4620163316583 411.5856081972362 257.1105527638191 412.91686950376885 S 239.31850251256282 474.434854428392 249.96859296482413 475.76611573492465 S 338.21036306532665 425.67526648869347 348.5276381909548 424.3440051821608 S 337.3640408291457 461.1772344535176 338.5288944723618 464.33898005653265 S 346.8778454773869 466.79295744346734 358.52638190954775 451.4834524183417',
    });
    layer.add(textpath);
    var path = new Konva.Path({
      stroke: 'red',
      scaleX: 0.8,
      scaleY: 0.8,
      data: 'M 109.98618090452261 138.6656132223618 C 135.94577638190955 48.80547503140701 149.91187876884422 79.79800957914573 151.40954773869348 117.23973382537689 S 123.00811620603017 419.616741991206 122.84170854271358 460.0538041771357 S 134.33883542713568 469.8304329459799 149.98115577889448 464.33898005653265 S 245.4620163316583 411.5856081972362 257.1105527638191 412.91686950376885 S 239.31850251256282 474.434854428392 249.96859296482413 475.76611573492465 S 338.21036306532665 425.67526648869347 348.5276381909548 424.3440051821608 S 337.3640408291457 461.1772344535176 338.5288944723618 464.33898005653265 S 346.8778454773869 466.79295744346734 358.52638190954775 451.4834524183417',
    });
    layer.add(path);
    layer.draw();

    var rect = textpath.getClientRect();

    // just different results in different envs
    if (isBrowser) {
      assert.equal(Math.round(rect.height), 329, 'check height');
    } else {
      assert.equal(Math.round(rect.height), 331, 'check height');
    }

    textpath.text('');
    rect = textpath.getClientRect();
    assert.equal(rect.height, 0, 'check height');
  });

  it('check bad calculations 2', function () {
    var stage = addStage();

    var layer = new Konva.Layer();
    stage.add(layer);

    var textpath = new Konva.TextPath({
      x: 0,
      y: 0,
      fill: '#333',
      fontSize: 10,
      // strokeWidth: 100,
      stroke: 'black',
      scaleX: 0.4,
      scaleY: 0.4,
      text: '....................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................',
      data: 'M 117.12814070351759 108.66938206658291 C 79.18719346733668 277.73956799623113 75.85761180904522 379.96743797110554 82.84673366834171 395.7761659861809 S 148.83130025125627 280.47708118718595 177.12060301507537 244.36661824748745 S 326.1725898241206 61.02036887562815 325.67336683417085 85.815110709799 S 174.998726758794 435.7304316896985 172.8354271356784 457.1970202575377 S 273.65633103015074 310.01551271984926 307.1042713567839 270.07767352386935 S 466.09929459798997 92.08432302135678 459.9422110552764 114.3829499057789 S 266.23512060301505 435.5226006595478 254.2537688442211 461.4821961369347 S 328.1430565326633 368.1639210113065 357.09798994974875 337.2120956344221 S 486.31961118090453 207.61623570979899 502.79396984924625 195.8012916143216 S 511.48859170854274 200.85065719221106 498.50879396984925 235.79626648869348 S 379.73086055276383 489.4401119660804 391.37939698492465 495.76360317211055 S 573.2022663316583 313.03941849874377 598.4962311557789 290.0751609610553 S 608.3285672110553 288.6610529208543 608.4949748743719 298.64551271984925 S 604.9168530150754 352.64801334799 599.9246231155779 375.778678548995 S 540.6820665829146 508.5077162374372 565.643216080402 497.19199513190955 S 690.3761155778894 408.77881799623117 814.1834170854271 278.6480252826633',
    });
    var path = new Konva.Path({
      x: 0,
      y: 0,
      stroke: 'red',
      scaleX: 0.4,
      scaleY: 0.4,
      data: 'M 117.12814070351759 108.66938206658291 C 79.18719346733668 277.73956799623113 75.85761180904522 379.96743797110554 82.84673366834171 395.7761659861809 S 148.83130025125627 280.47708118718595 177.12060301507537 244.36661824748745 S 326.1725898241206 61.02036887562815 325.67336683417085 85.815110709799 S 174.998726758794 435.7304316896985 172.8354271356784 457.1970202575377 S 273.65633103015074 310.01551271984926 307.1042713567839 270.07767352386935 S 466.09929459798997 92.08432302135678 459.9422110552764 114.3829499057789 S 266.23512060301505 435.5226006595478 254.2537688442211 461.4821961369347 S 328.1430565326633 368.1639210113065 357.09798994974875 337.2120956344221 S 486.31961118090453 207.61623570979899 502.79396984924625 195.8012916143216 S 511.48859170854274 200.85065719221106 498.50879396984925 235.79626648869348 S 379.73086055276383 489.4401119660804 391.37939698492465 495.76360317211055 S 573.2022663316583 313.03941849874377 598.4962311557789 290.0751609610553 S 608.3285672110553 288.6610529208543 608.4949748743719 298.64551271984925 S 604.9168530150754 352.64801334799 599.9246231155779 375.778678548995 S 540.6820665829146 508.5077162374372 565.643216080402 497.19199513190955 S 690.3761155778894 408.77881799623117 814.1834170854271 278.6480252826633',
    });
    layer.add(path);
    // emulate different size function:
    // I found the app with custom font
    // we calculations were not correct
    // so I just coppied text size from that app
    textpath._getTextSize = () => {
      return { height: 10, width: 5.9399871826171875 };
    };
    layer.add(textpath);

    layer.draw();

    var rect = textpath.getClientRect();
    assert.equal(Math.round(rect.width), 299);
    assert.equal(Math.round(rect.height), 171);
  });

  it.skip('check vertical text path', function () {
    var stage = addStage();

    var layer = new Konva.Layer();
    stage.add(layer);

    var textpath = new Konva.TextPath({
      x: -280,
      y: -190,
      fill: 'black',
      fontSize: 10,
      fontFamily: 'Arial',
      align: 'right',
      text: '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
      data: 'M 283 383 L 283 187',
    });
    layer.add(textpath);
    layer.draw();

    var rect = textpath.getClientRect();

    assert.equal(rect.height, 200, 'check height');
  });
});
