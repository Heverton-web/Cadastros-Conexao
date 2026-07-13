import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { LogIn, Loader2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { supabase } from "~/lib/supabase"

interface ClienteLoginProps {
  slug: string
}

export function ClienteLogin({ slug }: ClienteLoginProps) {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !senha) return

    setLoading(true)
    setError("")

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (authError) {
        setError("Email ou senha incorretos.")
        return
      }

      // Verifica se é um catalogo_cliente ativo
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Erro ao autenticar.")
        return
      }

      const { data: cliente } = await supabase
        .from("catalogo_clientes")
        .select("id, ativo")
        .eq("user_id", user.id)
        .eq("ativo", true)
        .maybeSingle()

      if (!cliente) {
        await supabase.auth.signOut()
        setError("Acesso não autorizado. Solicite acesso à empresa.")
        return
      }

      // Redireciona para a loja
      navigate({ to: `/loja/${slug}` })
    } catch {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Acessar Catálogo</h1>
          <p className="text-[var(--color-text-muted)]">
            Faça login para ver preços e realizar pedidos
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Senha</label>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !senha}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href={`/loja/${slug}`}
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            ← Voltar à loja
          </a>
        </div>
      </div>
    </div>
  )
}
