import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { useAuth } from "~/lib/auth";
import { useEmpresaConfig, useSalvarEmpresaConfig, useSecoes, useLinks } from "../hooks/useEmpresaLinktree";
import { ThemePanel } from "./ThemePanel";
import { SectionManager } from "./SectionManager";
import { LinksList } from "./LinksList";
import { EmpresaLinktreePreview } from "./EmpresaLinktreePreview";
import { DEFAULT_EMPRESA_THEME, normalizeEmpresaTheme, isValidSlug } from "../types-empresa";
import type { EmpresaLinktreeTheme } from "../types-empresa";

export function EmpresaLinktreeEditor() {
  const { profile } = useAuth();
  const { data: config, isLoading: loadingConfig } = useEmpresaConfig();
  const { data: sections = [] } = useSecoes();
  const { data: links = [] } = useLinks();
  const salvar = useSalvarEmpresaConfig();

  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [theme, setTheme] = useState<EmpresaLinktreeTheme>(DEFAULT_EMPRESA_THEME);
  const [slugError, setSlugError] = useState("");

  useEffect(() => {
    if (config) {
      setSlug(config.slug ?? "");
      setBio(config.bio ?? "");
      setBannerUrl(config.banner_url ?? "");
      setTheme(normalizeEmpresaTheme(config.theme));
    }
  }, [config]);

  function handleSlugChange(v: string) {
    const clean = v.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(clean);
    if (clean.length >= 3 && !isValidSlug(clean)) {
      setSlugError("Slug reservado ou invalido");
    } else {
      setSlugError("");
    }
  }

  async function handleSave() {
    if (!profile?.empresa_id) return;
    if (!slug || !isValidSlug(slug)) {
      setSlugError("Slug invalido (min 3 chars, lowercase, hifen)");
      return;
    }

    try {
      await salvar.mutateAsync({ slug, bio: bio || null, banner_url: bannerUrl || null, theme });
      toast.success("Linktree salvo!");
    } catch {
      toast.error("Erro ao salvar");
    }
  }

  if (loadingConfig) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-text-main">Editor Linktree</h1>
          <p className="mt-1 text-sm text-muted-foreground">Personalize o linktree da sua empresa.</p>
        </div>
        <Button onClick={handleSave} disabled={salvar.isPending} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
          {salvar.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Salvar
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
        <div className="rounded-xl border border-border bg-surface p-5">
          <Tabs defaultValue="conteudo">
            <TabsList className="grid w-full grid-cols-3 bg-surface-hover">
              <TabsTrigger value="conteudo">Conteudo</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="config">Config</TabsTrigger>
            </TabsList>

            <TabsContent value="conteudo" className="space-y-6 pt-5">
              <SectionManager sections={sections} />
              <LinksList sections={sections} links={links} />
            </TabsContent>

            <TabsContent value="visual" className="pt-5">
              <ThemePanel theme={theme} onChange={setTheme} />
            </TabsContent>

            <TabsContent value="config" className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <Label>Slug (URL publica)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/e/</span>
                  <Input
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="minha-empresa"
                    className={slugError ? "border-error" : ""}
                  />
                </div>
                {slugError && <p className="text-xs text-error">{slugError}</p>}
                {slug && isValidSlug(slug) && (
                  <p className="text-xs text-green-500">Link: /e/{slug}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Bio / Descricao</Label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Uma breve descricao da sua empresa..."
                  rows={3}
                  className="w-full rounded-md border border-border bg-surface-hover px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Banner (URL da imagem)</Label>
                <Input
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <EmpresaLinktreePreview
          sections={sections}
          links={links.filter((l) => l.ativo)}
          theme={theme}
          bio={bio}
          bannerUrl={bannerUrl}
          empresaNome={profile?.nome ?? "Sua Empresa"}
        />
      </div>
    </div>
  );
}
