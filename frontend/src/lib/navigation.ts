import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Brush,
  FileText,
  History,
  Home,
  ImageUpscale,
  Printer,
  Settings,
  Sparkles,
  VectorSquare,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  available: boolean;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: Home,
    available: true,
    description: "Visão geral do AI Visual Studio",
  },
  {
    id: "melhorar",
    label: "Melhorar imagens",
    href: "/melhorar-imagens",
    icon: Sparkles,
    available: true,
    description: "Redesenhar com IA ou aumentar resolução",
  },
  {
    id: "redesenhar",
    label: "Redesenhar imagens",
    icon: Brush,
    available: false,
    description: "Fluxo dedicado de redesenho criativo",
  },
  {
    id: "vetorizar",
    label: "Vetorizar logotipos",
    icon: VectorSquare,
    available: false,
    description: "Conversão de logotipos para vetor",
  },
  {
    id: "impressao",
    label: "Preparar impressão",
    icon: Printer,
    available: false,
    description: "Pré-impressão e arquivos de produção",
  },
  {
    id: "cnc",
    label: "Preparar CNC",
    icon: ImageUpscale,
    available: false,
    description: "Preparação de arquivos para CNC",
  },
  {
    id: "fachadas",
    label: "Criar fachadas 3D",
    icon: Boxes,
    available: false,
    description: "Visualização 3D de fachadas",
  },
  {
    id: "orcamentos",
    label: "Orçamentos",
    icon: FileText,
    available: false,
    description: "Geração de orçamentos comerciais",
  },
  {
    id: "historico",
    label: "Histórico",
    icon: History,
    available: false,
    description: "Histórico de processamentos",
  },
  {
    id: "configuracoes",
    label: "Configurações",
    icon: Settings,
    available: false,
    description: "Preferências do ambiente interno",
  },
];
