import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import api from '../api/axios';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import SaesSemaforoChart from '../components/SaesSemaforoChart';
import SaesPorCampoChart from '../components/SaesPorCampoChart';
import SaesPorTecnicoChart from '../components/SaesPorTecnicoChart';


export default function DashboardSaes() {
  const [kpis, setKpis] = useState(null);
  const [semaforo, setSemaforo] = useState(null);
  const navigate = useNavigate();
  const [porCampo, setPorCampo] = useState([]);
  const [porTecnico, setPorTecnico] = useState([]);

  const irASaes = (semaforo) => {
    navigate(`/saes?semaforo=${semaforo}`);
  };

  useEffect(() => {
    api.get('/dashboard/saes').then(res => setKpis(res.data));
    api.get('/dashboard/saes/semaforo').then(res => setSemaforo(res.data));
    api.get('/dashboard/saes/campo').then(res => setPorCampo(res.data));
    api.get('/dashboard/saes/tecnico').then(res => setPorTecnico(res.data));
  }, []);


  if (!kpis) return null;

  const KpiCard = ({ title, value, color }) => (
    <Card>
      <CardContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h4" color={color}>{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <>

      <Grid container spacing={2}>

        {/* KPIs */}
        <Grid item xs={12} md={3}>
          <div onClick={() => irASaes('CRITICO')} style={{ cursor: 'pointer' }}>
            <KpiCard title="Críticos" value={kpis.criticos} color="error" />
          </div>
        </Grid>
        <Grid item xs={12} md={3}>
          <div onClick={() => irASaes('ADVERTENCIA')} style={{ cursor: 'pointer' }}>
            <KpiCard title="Advertencia" value={kpis.advertencia} color="warning.main" />
          </div>
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard title="Instalados" value={kpis.instalados} />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard title="Retirados" value={kpis.retirados} />
        </Grid>

        <Grid item xs={12} md={3}>
          <KpiCard
            title="Antigüedad Promedio (días)"
            value={kpis.antiguedad_promedio}
          />
        </Grid>

        {/* Gráfico */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Semáforo SAES (Instalados)
              </Typography>
              {semaforo && <SaesSemaforoChart data={semaforo} />}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SAES Instalados por Campo
              </Typography>

              <SaesPorCampoChart data={porCampo} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SAES Instalados por Técnico
              </Typography>

              <SaesPorTecnicoChart data={porTecnico} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}