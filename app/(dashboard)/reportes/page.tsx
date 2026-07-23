import { createClient } from '@/utils/supabase/server'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ReportesPage() {
  const supabase = await createClient()

  const [
    { data: ventasDiarias },
    { data: inventario },
    { data: alertasActivas },
  ] = await Promise.all([
    supabase.from('reporte_ventas_diarias').select('*').limit(30),
    supabase.from('reporte_inventario_actual').select('*'),
    supabase.from('reporte_alertas_activas').select('*'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <BarChart3 className="size-6" />
          Reportes
        </h1>
        <p className="text-muted-foreground">
          Resumen y reportes del sistema
        </p>
      </div>

      {/* Reporte de Inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario Actual</CardTitle>
        </CardHeader>
        <CardContent>
          {inventario && inventario.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inventario.map((item: { surtidor: number; combustible: string; nivel_litros: number; porcentaje: number; nivel: string }) => (
                <div key={item.surtidor} className="rounded-lg border p-4">
                  <div className="text-lg font-bold">Surtidor N° {item.surtidor}</div>
                  <div className="text-sm text-muted-foreground">{item.combustible}</div>
                  <div className="mt-2 text-2xl font-bold">{item.nivel_litros} L</div>
                  <div className="text-sm">{item.porcentaje}% — {item.nivel}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Sin datos de inventario.</p>
          )}
        </CardContent>
      </Card>

      {/* Reporte de Ventas Diarias */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas Diarias</CardTitle>
        </CardHeader>
        <CardContent>
          {ventasDiarias && ventasDiarias.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Día</th>
                    <th className="p-2 text-left">Combustible</th>
                    <th className="p-2 text-right">Ventas</th>
                    <th className="p-2 text-right">Litros</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasDiarias.map((v: { dia: string; combustible: string; total_ventas: number; total_litros: number; total_ingresos: number }, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{new Date(v.dia).toLocaleDateString()}</td>
                      <td className="p-2">{v.combustible}</td>
                      <td className="p-2 text-right">{v.total_ventas}</td>
                      <td className="p-2 text-right">{v.total_litros} L</td>
                      <td className="p-2 text-right">Bs. {v.total_ingresos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Sin datos de ventas.</p>
          )}
        </CardContent>
      </Card>

      {/* Alertas Activas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Activas</CardTitle>
        </CardHeader>
        <CardContent>
          {alertasActivas && alertasActivas.length > 0 ? (
            <div className="space-y-2">
              {alertasActivas.map((a: { id: number; surtidor: number; combustible: string; tipo: string; horas_activa: number }) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <span className="font-medium">Surtidor N° {a.surtidor}</span>
                    <span className="ml-2 text-muted-foreground">({a.combustible})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{(a.horas_activa ?? 0).toFixed(1)}h</span>
                    <span className={`text-sm font-medium ${a.tipo === 'critico' ? 'text-red-600' : 'text-orange-600'}`}>
                      {a.tipo === 'critico' ? 'Crítico' : 'Bajo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No hay alertas activas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
