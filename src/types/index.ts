export type CategoriaProducto =
  | 'Cemento y Hormigón'
  | 'Hierros y Aceros'
  | 'Pinturas'
  | 'Sanitarios'
  | 'Herramientas'
  | 'Maderas'

export interface Producto {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  categoria: CategoriaProducto
  imagen_url: string | null
  stock: number
  activo: boolean
  created_at: string
}

export interface ItemCarrito {
  producto: Producto
  cantidad: number
}

export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'en preparación'
  | 'enviado'
  | 'entregado'

export interface Pedido {
  id: string
  numero_pedido: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string | null
  direccion_entrega: string
  items: ItemCarrito[]
  subtotal: number
  total: number
  estado: EstadoPedido
  created_at: string
}

export interface MensajeContacto {
  id: string
  nombre: string
  email: string
  mensaje: string
  leido: boolean
  created_at: string
}

export interface DatosCheckout {
  nombre: string
  apellido: string
  telefono: string
  email: string
  direccion: string
}

export type TipoCalculo = 'revoque' | 'contrapiso' | 'pintura' | 'estructura'

export interface ResultadoCalculo {
  tipo: TipoCalculo
  superficie: number
  materiales: { nombre: string; cantidad: number; unidad: string }[]
}
