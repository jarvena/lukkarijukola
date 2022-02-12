var wms_layers = [];


function rotateProjection(projection, angle, extent) {
    function rotateCoordinate(coordinate, angle, anchor) {
      var coord = ol.coordinate.rotate(
        [coordinate[0] - anchor[0], coordinate[1] - anchor[1]],
        angle
      );
      return [coord[0] + anchor[0], coord[1] + anchor[1]];
    }
  
    function rotateTransform(coordinate) {
      return rotateCoordinate(coordinate, angle, ol.extent.getTopLeft(extent));
    }
  
    function normalTransform(coordinate) {
      return rotateCoordinate(coordinate, -angle, ol.extent.getTopLeft(extent));
    }
  
    var normalProjection = ol.proj.get(projection);
  
    var rotatedProjection = new ol.proj.Projection({
      code:
        normalProjection.getCode() +
        ":" +
        angle.toString() +
        ":" +
        extent.toString(),
      units: normalProjection.getUnits(),
      extent: extent
    });
    ol.proj.addProjection(rotatedProjection);
  
    ol.proj.addCoordinateTransforms(
      "EPSG:4326",
      rotatedProjection,
      function(coordinate) {
        return rotateTransform(transform(coordinate, "EPSG:4326", projection));
      },
      function(coordinate) {
        return ol.proj.transform(normalTransform(coordinate), projection, "EPSG:4326");
      }
    );
  
    ol.proj.addCoordinateTransforms(
      "EPSG:3857",
      rotatedProjection,
      function(coordinate) {
        return rotateTransform(ol.proj.transform(coordinate, "EPSG:3857", projection));
      },
      function(coordinate) {
        return transform(normalTransform(coordinate), projection, "EPSG:3857");
      }
    );
  
    // also set up transforms with any projections defined using proj4
    if (typeof proj4 !== "undefined") {
      var projCodes = Object.keys(proj4.defs);
      projCodes.forEach(function(code) {
        var proj4Projection = ol.proj.get(code);
        if (!getTransform(proj4Projection, rotatedProjection)) {
          addCoordinateTransforms(
            proj4Projection,
            rotatedProjection,
            function(coordinate) {
              return rotateTransform(
                transform(coordinate, proj4Projection, projection)
              );
            },
            function(coordinate) {
              return transform(
                normalTransform(coordinate),
                projection,
                proj4Projection
              );
            }
          );
        }
      });
    }
  
    return rotatedProjection;
}

var rotatedProjection = rotateProjection("EPSG:3857", 4.512 * Math.PI/180, [2448046.0384895326570, 8550225.4141896273941-2229*5.1755846175170, 2448046.0384895326570+1720*5.1755846175170, 8550225.4141896273941])//[2447133.291079, 8537991.430003, 2456945.555396, 8550228.206191])


    var projection_MapAnt_0 = ol.proj.get('EPSG:3857');
    var projectionExtent_MapAnt_0 = projection_MapAnt_0.getExtent();
    var size_MapAnt_0 = ol.extent.getWidth(projectionExtent_MapAnt_0) / 256;
    var resolutions_MapAnt_0 = new Array(14);
    var matrixIds_MapAnt_0 = new Array(14);
    for (var z = 13; z < 20; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions_MapAnt_0[z] = size_MapAnt_0 / Math.pow(2, z);
        matrixIds_MapAnt_0[z] = z;
    }
    var lyr_MapAnt_0 = new ol.layer.Tile({
                            source: new ol.source.WMTS(({
                              url: "http://wmts.mapant.fi/wmts_EPSG3857.php",
    attributions: ' ',
                                "layer": "MapAnt.fi_EPSG3857",
                                "TILED": "true",
             matrixSet: 'EPSG:3857',
             format: 'image/png',
              projection: projection_MapAnt_0,
              tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent_MapAnt_0),
                resolutions: resolutions_MapAnt_0,
                matrixIds: matrixIds_MapAnt_0
              }),
              style: 'default',
              wrapX: true,
                                "VERSION": "1.0.0",
                            })),
                            title: "MapAnt",
                            opacity: 1.0,
                            
                            
                          });
var lyr_Lukkari_Jukola_vanha_georeferenced_1 = new ol.layer.Image({
                            opacity: 1,
                            title: "Kartta 2010",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/Lukkari_Jukola_vanha_georeferenced.png",
    attributions: ' ',
                                projection: rotatedProjection,
                                alwaysInRange: true,
                                imageExtent: [2448046.0384895326570, 8550225.4141896273941-2229*5.1755846175170, 2448046.0384895326570+1720*5.1755846175170, 8550225.4141896273941] //[2447133.291079, 8537991.430003, 2456945.555396, 8550228.206191]
                            })
                        });


var format_kilpailukielto_2 = new ol.format.GeoJSON();
var features_kilpailukielto_2 = format_kilpailukielto_2.readFeatures(json_kilpailukielto_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_kilpailukielto_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_kilpailukielto_2.addFeatures(features_kilpailukielto_2);
var lyr_kilpailukielto_2 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_kilpailukielto_2, 
                style: style_kilpailukielto_2,
                interactive: false,
                title: '<img src="styles/legend/kilpailukielto_2.png" /> Kilpailukielto'
            });

lyr_MapAnt_0.setVisible(true);lyr_Lukkari_Jukola_vanha_georeferenced_1.setVisible(true);lyr_kilpailukielto_2.setVisible(true);
var layersList = [lyr_MapAnt_0,lyr_Lukkari_Jukola_vanha_georeferenced_1,lyr_kilpailukielto_2];
lyr_kilpailukielto_2.set('fieldAliases', {'name': 'name', 'club': 'club', 'contact_person': 'contact_person', 'email': 'email', 'www': 'www', 'aluevoimassa_alkaa': 'aluevoimassa_alkaa', 'aluevoimassa_loppuu': 'aluevoimassa_loppuu', 'lisatiedot': 'lisatiedot', 'phone': 'phone', 'mittakaava': 'mittakaava', 'maastotyyppi': 'maastotyyppi', 'maaston_erityispiirteet': 'maaston_erityispiirteet', 'maaston_korkeus': 'maaston_korkeus', 'valmistumisvuosi': 'valmistumisvuosi', 'osoite': 'osoite', 'kl_numero': 'kl_numero', 'kv_numero': 'kv_numero', 'sijainti': 'sijainti', 'alue': 'alue', 'raporttinumero': 'raporttinumero', 'kartanlaji': 'kartanlaji', 'kayravali': 'kayravali', 'club_id': 'club_id', 'file': 'file', });
lyr_kilpailukielto_2.set('fieldImages', {'name': 'TextEdit', 'club': 'TextEdit', 'contact_person': 'TextEdit', 'email': 'TextEdit', 'www': 'TextEdit', 'aluevoimassa_alkaa': 'DateTime', 'aluevoimassa_loppuu': 'DateTime', 'lisatiedot': 'TextEdit', 'phone': 'TextEdit', 'mittakaava': 'TextEdit', 'maastotyyppi': 'TextEdit', 'maaston_erityispiirteet': 'TextEdit', 'maaston_korkeus': 'TextEdit', 'valmistumisvuosi': 'TextEdit', 'osoite': 'TextEdit', 'kl_numero': 'TextEdit', 'kv_numero': 'TextEdit', 'sijainti': 'TextEdit', 'alue': 'TextEdit', 'raporttinumero': 'TextEdit', 'kartanlaji': 'TextEdit', 'kayravali': 'TextEdit', 'club_id': 'TextEdit', 'file': 'TextEdit', });
lyr_kilpailukielto_2.set('fieldLabels', {'name': 'no label', 'club': 'no label', 'contact_person': 'no label', 'email': 'no label', 'www': 'no label', 'aluevoimassa_alkaa': 'no label', 'aluevoimassa_loppuu': 'no label', 'lisatiedot': 'no label', 'phone': 'no label', 'mittakaava': 'no label', 'maastotyyppi': 'no label', 'maaston_erityispiirteet': 'no label', 'maaston_korkeus': 'no label', 'valmistumisvuosi': 'no label', 'osoite': 'no label', 'kl_numero': 'no label', 'kv_numero': 'no label', 'sijainti': 'no label', 'alue': 'no label', 'raporttinumero': 'no label', 'kartanlaji': 'no label', 'kayravali': 'no label', 'club_id': 'no label', 'file': 'no label', });
lyr_kilpailukielto_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});