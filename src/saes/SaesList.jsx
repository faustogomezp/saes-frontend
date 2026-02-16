import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Button, TextField, MenuItem, Chip, Box,
  TablePagination, AppBar, Toolbar
} from '@mui/material';
import CrearSaes from './CrearSaes';
import SaesDetail from './SaesDetail';
import RetirarSaes from './RetirarSaes';


export default function SaesList({ user }) {
  const [saes, setSaes] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const semaforo = params.get('semaforo');
  const [refresh, setRefresh] = useState(false);
  const [selectedSaesId, setSelectedSaesId] = useState(null);
  const [filtroNumero, setFiltroNumero] = useState('');
  const [filtroCampo, setFiltroCampo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [campos, setCampos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtroOrden, setFiltroOrden] = useState('');
  const [openRetiro, setOpenRetiro] = useState(false);
  const [saesSeleccionado, setSaesSeleccionado] = useState(null);
  const [detalleVersion, setDetalleVersion] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setPage(0);
  }, [filtroNumero, filtroOrden, filtroCampo, filtroEstado, fechaDesde, fechaHasta]);

  useEffect(() => {
    api.get('/saes').then(res => setSaes(res.data));
  }, [refresh]);

  useEffect(() => {
    api.get('/campos').then(res => setCampos(res.data));
  }, []);

  useEffect(() => {
    api.get(`/saes${location.search}`)
      .then(res => setSaes(res.data));
  }, [location.search]);

  const calcularAntiguedad = (fechaInstalacion) => {
    if (!fechaInstalacion) return null;

    const inicio = new Date(fechaInstalacion);
    const hoy = new Date();

    // quitar horas para evitar errores
    inicio.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const diffMs = hoy - inicio;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDias;
  };

  const getColorAntiguedad = (dias) => {
    if (dias <= 7) return 'success';   // verde
    if (dias <= 15) return 'warning';  // amarillo
    return 'error';                    // rojo
  };
  const saesFiltrados = saes.filter(s => {
    const fechaInstalacion = s.fecha_instalacion
      ? new Date(s.fecha_instalacion)
      : null;

    const fechaInicio = fechaDesde ? new Date(fechaDesde) : null;
    const fechaFin = fechaHasta
      ? new Date(`${fechaHasta}T23:59:59.999`)
      : null;

    return (
      (!filtroNumero || s.numero_saes.toLowerCase().includes(filtroNumero.toLowerCase())) &&
      (!filtroOrden ||
        (s.numero_orden_instalacion &&
          s.numero_orden_instalacion
            .toLowerCase()
            .includes(filtroOrden.toLowerCase())) ||
        (s.numero_orden_retiro &&
          s.numero_orden_retiro
            .toLowerCase()
            .includes(filtroOrden.toLowerCase()))
      ) &&
      (!filtroCampo || s.campo === filtroCampo) &&
      (!filtroEstado || s.estado === filtroEstado) &&
      (!fechaInicio || (fechaInstalacion && fechaInstalacion >= fechaInicio)) &&
      (!fechaFin || (fechaInstalacion && fechaInstalacion <= fechaFin))
    );
  });

  const resumenAntiguedad = saesFiltrados.reduce(
    (acc, s) => {
      if (s.estado !== 'INSTALADO') return acc;

      const dias = calcularAntiguedad(s.fecha_instalacion);

      if (dias > 15) acc.criticos++;
      else if (dias > 7) acc.atencion++;
      else acc.normales++;

      return acc;
    },
    { criticos: 0, atencion: 0, normales: 0 }
  );

  const saesPaginados = saesFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const exportarExcel = async () => {
    try {
      const params = new URLSearchParams({
        numero_saes: filtroNumero,
        numero_orden: filtroOrden,
        campo: filtroCampo,
        estado: filtroEstado,
        desde: fechaDesde,
        hasta: fechaHasta
      });

      const response = await api.get(
        `/saes/export/excel?${params.toString()}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SAES.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error al exportar Excel');
    }
  };


  return (
    <>
      {user.rol === 'TECNICO' && (
        <CrearSaes onCreated={() => setRefresh(!refresh)} />
      )}

      <Typography variant="h6" sx={{ m: 2 }}>
        SAES Registrados
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, m: 2, }}>
        <Chip
          label={`Críticos: ${resumenAntiguedad.criticos}`}
          color="error"
        />
        <Chip
          label={`En atención: ${resumenAntiguedad.atencion}`}
          color="warning"
        />
        <Chip
          label={`Normales: ${resumenAntiguedad.normales}`}
          color="success"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, m: 2 }}>
        <TextField
          label="Número SAES"
          value={filtroNumero}
          onChange={e => setFiltroNumero(e.target.value)}
        />
        <TextField
          label="N° Orden / Aviso"
          value={filtroOrden}
          onChange={e => setFiltroOrden(e.target.value)}
        />
        <TextField
          select
          label="Campo"
          value={filtroCampo}
          onChange={e => setFiltroCampo(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {campos.map(c => (
            <MenuItem key={c.id} value={c.nombre}>
              {c.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Estado"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="INSTALADO">INSTALADO</MenuItem>
          <MenuItem value="RETIRADO">RETIRADO</MenuItem>
        </TextField>
        <TextField
          type="date"
          label="Desde"
          InputLabelProps={{ shrink: true }}
          value={fechaDesde}
          onChange={e => setFechaDesde(e.target.value)}
        />

        <TextField
          type="date"
          label="Hasta"
          InputLabelProps={{ shrink: true }}
          value={fechaHasta}
          onChange={e => setFechaHasta(e.target.value)}
        />

        <Button variant="outlined" onClick={exportarExcel}>
          Exportar Excel
        </Button>

      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>N° SAES</TableCell>
            <TableCell>Ord. Instalación</TableCell>
            <TableCell>Ord. Retiro</TableCell>
            <TableCell>Campo</TableCell>
            <TableCell>Equipo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha Retiro</TableCell>
            <TableCell>Antigüedad (días)</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {saesPaginados.map(s => (
            <TableRow
              key={s.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => setSelectedSaesId(s.id)}
            >

              <TableCell>{s.numero_saes}</TableCell>
              <TableCell>{s.numero_orden_instalacion}</TableCell>
              <TableCell>{s.numero_orden_retiro || '-'}</TableCell>
              <TableCell>{s.campo}</TableCell>
              <TableCell>{s.equipo}</TableCell>
              <TableCell>
                <Chip
                  label={s.estado}
                  color={s.estado === 'INSTALADO' ? 'success' : 'error'}
                  variant={s.estado === 'RETIRADO' ? 'filled' : 'outlined'}
                />
              </TableCell>
              <TableCell>
                {s.fecha_retiro
                  ? new Date(s.fecha_retiro).toLocaleDateString()
                  : '—'}
              </TableCell>
              <TableCell>

                {s.estado === 'INSTALADO' ? (
                  (() => {
                    const dias = calcularAntiguedad(s.fecha_instalacion);
                    return (
                      <Chip
                        label={`${dias} días`}
                        color={getColorAntiguedad(dias)}
                        size="small"
                      />
                    );
                  })()
                ) : (
                  '—'
                )}
              </TableCell>

              <TableCell align="center">
                {s.estado === 'INSTALADO' && user.rol === 'TECNICO' && (
                  <Button
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // 🔴 CLAVE
                      setSaesSeleccionado(s.id);
                      setOpenRetiro(true);
                    }}
                  >
                    Retirar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={saesFiltrados.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
      {selectedSaesId && (
        <SaesDetail
          saesId={selectedSaesId}
          refreshKey={detalleVersion}
          onClose={() => setSelectedSaesId(null)}
        />
      )}
      <RetirarSaes
        open={openRetiro}
        saesId={saesSeleccionado}
        onClose={() => setOpenRetiro(false)}
        onSuccess={() => {
          setOpenRetiro(false);
          setRefresh(!refresh);
          setDetalleVersion(v => v + 1);
        }}
      />
    </>
  );
}