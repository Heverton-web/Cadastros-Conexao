import { useState, useEffect } from "react";
import { PenLine, Search, Instagram, Facebook, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "~/lib/auth";
import { PageHeader } from "~/components/ui/page-header";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { EmptyState } from "~/components/ui/empty-state";
import { supabase } from "~/core/supabase";

type MetaPost = {
  id: string;
  empresa_id: string;
  meta_post_id: string | null;
  conteudo: string | null;
  midia_url: string | null;
  plataforma: string | null;
  status: string;
  agendado_para: string | null;
  publicado_em: string | null;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  rascunho: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  agendado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  publicado: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PLATAFORMA_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
};

async function listarPosts(empresaId: string): Promise<MetaPost[]> {
  const { data } = await supabase
    .from("mktg_meta_posts")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });
  return (data as MetaPost[]) || [];
}

export function MetaPostsList() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<MetaPost[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (!profile?.empresa_id) {
      setCarregando(false);
      return;
    }
    listarPosts(profile.empresa_id)
      .then(setPosts)
      .catch(() => toast.error("Erro ao carregar posts"))
      .finally(() => setCarregando(false));
  }, [profile?.empresa_id]);

  const filtrados = posts.filter(
    (p) => !busca || (p.conteudo || "").toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Posts Meta"
        description="Gerencie seus posts agendados e publicados"
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          placeholder="Buscar posts..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={<PenLine className="w-8 h-8 text-text-muted" />}
          title="Nenhum post cadastrado"
          description="Conecte sua conta Meta Business Manager para sincronizar posts e agendamentos."
        />
      ) : (
        <div className="space-y-3">
          {filtrados.map((post) => {
            const PlataformaIcon = post.plataforma ? PLATAFORMA_ICONS[post.plataforma] : null;
            return (
              <Card key={post.id} className="hover:border-accent/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {post.midia_url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface shrink-0">
                        <img src={post.midia_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {PlataformaIcon && (
                          <PlataformaIcon size={14} className="text-blue-400" />
                        )}
                        {post.plataforma && (
                          <span className="text-xs capitalize text-text-muted">{post.plataforma}</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[post.status] || "bg-surface text-text-muted border-border"}`}>
                          {post.status}
                        </span>
                      </div>
                      {post.conteudo && (
                        <p className="text-sm text-text-main line-clamp-2">{post.conteudo}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        {post.agendado_para && post.status === "agendado" && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(post.agendado_para).toLocaleString("pt-BR")}
                          </span>
                        )}
                        {post.publicado_em && (
                          <span>Publicado: {new Date(post.publicado_em).toLocaleDateString("pt-BR")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtrados.length === 0 && busca && (
            <EmptyState title="Nenhum resultado" description="Nenhum post encontrado." />
          )}
        </div>
      )}
    </div>
  );
}
