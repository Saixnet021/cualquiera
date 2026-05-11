
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase.config';

const PRODUCTS_DATA = [
  {
    name: "SUDADERA CYBERPUNK",
    description: "Sudadera oversize negra industrial con detalles técnicos. 100% algodón pesado.",
    price: 89,
    stock: 15,
    category: "MODA",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    variants: [
      { size: "S", stock: 5 },
      { size: "M", stock: 5 },
      { size: "L", stock: 5 }
    ]
  },
  {
    name: "TECLADO MECÁNICO NEÓN",
    description: "Teclado mecánico con diseño 60% y teclas personalizadas B&W. Interruptores Gateron Brown.",
    price: 120,
    stock: 8,
    category: "TECNOLOGÍA",
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "BILLETERA DE CUERO MINIMALISTA",
    description: "Billetera de cuero ultra delgada. Protección RFID. Espacio para 8 tarjetas.",
    price: 45,
    stock: 20,
    category: "ESTILO DE VIDA",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "PANTALONES CARGO TECHWEAR",
    description: "Pantalones cargo resistentes al agua con múltiples bolsillos y correas tácticas.",
    price: 110,
    stock: 12,
    category: "MODA",
    imageUrl: "https://images.unsplash.com/photo-1617113930975-f9c732338296?q=80&w=800&auto=format&fit=crop",
    variants: [
      { size: "30", stock: 4 },
      { size: "32", stock: 4 },
      { size: "34", stock: 4 }
    ]
  },
  {
    name: "ZAPATILLAS URBANAS V1",
    description: "Zapatillas minimalistas totalmente negras. Cuero sintético y malla transpirable.",
    price: 95,
    stock: 10,
    category: "CALZADO",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    variants: [
      { size: "40", stock: 3 },
      { size: "42", stock: 4 },
      { size: "44", stock: 3 }
    ]
  },
  {
    name: "AURICULARES CON CANCELACIÓN DE RUIDO",
    description: "Auriculares inalámbricos negro mate. 40h de batería. ANC híbrido.",
    price: 250,
    stock: 5,
    category: "TECNOLOGÍA",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "BOTELLA DE AGUA DE ACERO INOXIDABLE",
    description: "Botella de agua con aislamiento al vacío. 750ml. Mantiene el frío por 24h.",
    price: 35,
    stock: 30,
    category: "ESTILO DE VIDA",
    imageUrl: "https://images.unsplash.com/photo-1602143303410-71998893ee59?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "MOCHILA TÁCTICA",
    description: "Mochila táctica de 25L con compartimento para laptop. Compatible con sistema Molle.",
    price: 130,
    stock: 7,
    category: "ESTILO DE VIDA",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "RELOJ DE CUARZO ANALÓGICO",
    description: "Reloj analógico totalmente negro. Cristal mineral. Resistente al agua 5ATM.",
    price: 150,
    stock: 6,
    category: "ESTILO DE VIDA",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "CAMISETA GRÁFICA OVERSIZE",
    description: "Camiseta de algodón pesado con estampado gráfico industrial.",
    price: 40,
    stock: 25,
    category: "MODA",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    variants: [
      { size: "M", stock: 12 },
      { size: "L", stock: 13 }
    ]
  },
  {
    name: "HUB DE HOGAR INTELIGENTE",
    description: "Controlador de hogar inteligente minimalista con pantalla táctil.",
    price: 180,
    stock: 4,
    category: "TECNOLOGÍA",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "GORRO BEANIE LOGO NEGRO",
    description: "Gorro de punto con logo bordado. Tejido acrílico suave.",
    price: 25,
    stock: 40,
    category: "MODA",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d365350?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "TAPETE DE ESCRITORIO NEGRO MATE",
    description: "Tapete de escritorio extra grande. Deslizamiento suave para ratones de juego.",
    price: 30,
    stock: 15,
    category: "TECNOLOGÍA",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "BOLSO TOTE DE LONA",
    description: "Bolso tote de lona reforzada. Perfecto para los esenciales diarios.",
    price: 20,
    stock: 50,
    category: "ESTILO DE VIDA",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "CARGADOR RÁPIDO USB-C",
    description: "Cargador rápido GaN de 65W. Diseño compacto. 3 puertos.",
    price: 55,
    stock: 18,
    category: "TECNOLOGÍA",
    imageUrl: "https://images.unsplash.com/photo-1610944230741-94943916960d?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "SILLA DE ESCRITORIO DE CUERO",
    description: "Silla de cuero ergonómica para espacio de trabajo. Altura ajustable.",
    price: 320,
    stock: 3,
    category: "ESTILO DE VIDA",
    imageUrl: "https://images.unsplash.com/photo-1505843490701-5be550b33062?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "CAFETERA MODERNA",
    description: "Cafetera de goteo con temporizador programable. Diseño elegante.",
    price: 140,
    stock: 9,
    category: "ESTILO DE VIDA",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "RATÓN GAMING INALÁMBRICO",
    description: "Ratón inalámbrico ultra ligero. Sensor de 20k DPI. Pies de PTFE.",
    price: 90,
    stock: 11,
    category: "TECNOLOGÍA",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    variants: []
  },
  {
    name: "CHAQUETA CORTAVIENTOS",
    description: "Chaqueta cortavientos ligera. Diseño empacable. Con capucha.",
    price: 75,
    stock: 14,
    category: "MODA",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
    variants: [
      { size: "S", stock: 7 },
      { size: "L", stock: 7 }
    ]
  },
  {
    name: "ZAPATILLAS DE RUNNING X1",
    description: "Zapatillas de running de alto rendimiento. Placa de carbono y espuma reactiva.",
    price: 180,
    stock: 6,
    category: "CALZADO",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    variants: [
      { size: "41", stock: 3 },
      { size: "43", stock: 3 }
    ]
  }
];

const CATEGORIES = ["MODA", "TECNOLOGÍA", "ESTILO DE VIDA", "CALZADO"];

export async function seedDatabase() {
  console.log("Iniciando seed...");
  
  // 1. Seed Categories
  const categoriesRef = collection(db, 'categories');
  const catSnapshot = await getDocs(categoriesRef);
  
  if (catSnapshot.empty) {
    for (const cat of CATEGORIES) {
      await addDoc(categoriesRef, { name: cat, createdAt: serverTimestamp() });
    }
    console.log("Categorías pobladas.");
  }

  // 2. Seed Products
  const productsRef = collection(db, 'products');
  const prodSnapshot = await getDocs(productsRef);
  
  if (prodSnapshot.empty) {
    for (const prod of PRODUCTS_DATA) {
      await addDoc(productsRef, {
        ...prod,
        createdAt: serverTimestamp()
      });
    }
    console.log("Productos poblados.");
  }

  return { success: true };
}
