const express = require('express');
const router  = express.Router();

const GEOJSON_URL = 'https://dados.recife.pe.gov.br/dataset/8512f8d0-b0be-4880-9fbd-3d568c65ca1a/resource/1c9feb5e-38ad-4235-b3d2-771964c59c46/download/rotas-ciclaveis-do-recife-permanente.geojson';

router.get('/', async (req, res) => {
  try {
    const response = await fetch(GEOJSON_URL);
    const geojson  = await response.json();

    const registros = geojson.features
      .filter((f) => f.geometry?.coordinates?.length > 0)
      .map((feature, index) => {
        const segmento = feature.geometry.coordinates[0] || [];
        const meio     = Math.floor(segmento.length / 2);
        return {
          _id:        index + 1,
          tipo:       feature.properties?.Tipo       || 'N/D',
          bairro:     feature.properties?.Bairro     || 'N/D',
          logradouro: feature.properties?.Logradouro || '',
          nome:       feature.properties?.Nome       || '',
          sentido:    feature.properties?.Sentido    || '',
          latitude:   segmento[meio]?.[1] ?? null,
          longitude:  segmento[meio]?.[0] ?? null,
        };
      });

    res.json({ sucesso: true, dados: registros, total: registros.length });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

module.exports = router;