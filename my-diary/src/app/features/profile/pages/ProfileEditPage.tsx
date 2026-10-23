import { type FormEvent, useMemo, useState } from 'react'
import { axiosClient } from '../../../core/api/axiosClient'
import { endpoints } from '../../../core/api/endpoints'
import { UiIcon } from '../../../shared/components/UiIcon'
import { storageService } from '../../auth/services/storage.service'
import type { UserRequest } from '../../auth/models/user.request'
import type { UserResponse } from '../../auth/models/user.response'

const updateProfile = (userId: number, payload: UserRequest) => {
    return axiosClient.request<UserResponse>(`${endpoints.users}/${userId}`, {
        method: 'PUT',
        body: payload,
    })
}

export function ProfileEditPage() {
    const currentUser = storageService.getUser()
    const [username, setUsername] = useState(currentUser?.username ?? '')
    const [email, setEmail] = useState(currentUser?.email ?? '')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState(currentUser?.firstName ?? '')
    const [lastName, setLastName] = useState(currentUser?.lastName ?? '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const initials = useMemo(() => {
        const first = currentUser?.firstName?.[0] ?? currentUser?.username?.[0] ?? 'M'
        const last = currentUser?.lastName?.[0] ?? 'D'
        return `${first}${last}`.toUpperCase()
    }, [currentUser?.firstName, currentUser?.lastName, currentUser?.username])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!currentUser?.id) {
            setError('No se encontró el usuario actual.')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const updatedUser = await updateProfile(currentUser.id, {
                username,
                email,
                password,
                firstName,
                lastName,
            })

            const mergedUser = {
                ...currentUser,
                ...updatedUser,
            }

            storageService.setUser(mergedUser)
            setSuccess('Perfil actualizado correctamente.')

            window.setTimeout(() => {
                window.location.href = '/profile'
            }, 900)
        } catch (updateError) {
            setError(updateError instanceof Error ? updateError.message : 'No se pudo actualizar el perfil')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 px-4 py-6 shadow-[0_24px_80px_rgba(70,90,160,0.14)] backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(108,142,252,0.20),transparent_0_26%),radial-gradient(circle_at_85%_10%,rgba(244,143,177,0.18),transparent_0_24%),radial-gradient(circle_at_50%_100%,rgba(179,140,255,0.18),transparent_0_30%)]" />

            <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div className="space-y-6 text-[#1f2140]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(108,142,252,0.18)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#4566d9] shadow-sm">
                        <UiIcon name="settings" />
                        Editar perfil
                    </span>

                    <h1 className="max-w-xl text-2xl font-semibold leading-snug tracking-tight text-[#1f2140]">
                        No olvides mantener tu perfil actualizado para una mejor experiencia. 
                    </h1>

                    <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(70,90,160,0.08)]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6c8efc,#f48fb1)] text-xl font-bold text-white shadow-lg shadow-[#6c8efc33]">
                                {initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4566d9]">Tu perfil</p>
                                <h2 className="text-lg font-semibold text-[#1f2140]">
                                    {currentUser ? `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() || currentUser.username : 'Usuario'}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/80 bg-white/92 p-6 shadow-[0_24px_80px_rgba(70,90,160,0.14)] sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4 border-b border-[rgba(90,101,160,0.12)] pb-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d25b8a]">Formulario</p>
                            <h2 className="mt-1 text-2xl font-semibold text-[#1f2140]">Editar datos del perfil</h2>
                        </div>
                        <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#f48fb1,#b38cff)] text-white shadow-lg">
                            <UiIcon name="profile" />
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="sm:col-span-2 block text-sm font-medium text-[#374151]">
                            Username
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                                <UiIcon name="profile" />
                                <input
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    type="text"
                                    placeholder="martin.diary"
                                    className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]"
                                />
                            </div>
                        </label>

                        <label className="sm:col-span-2 block text-sm font-medium text-[#374151]">
                            Email
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                                <UiIcon name="mail" />
                                <input
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    type="email"
                                    placeholder="demo@correo.com"
                                    className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]"
                                />
                            </div>
                        </label>

                        <label className="sm:col-span-2 block text-sm font-medium text-[#374151]">
                            Contraseña <span className="text-[#d25b8a]">(obligatoria para guardar cambios)</span>
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                                <UiIcon name="lock" />
                                <input
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]"
                                />
                            </div>
                        </label>

                        <label className="block text-sm font-medium text-[#374151]">
                            Nombre
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                                <UiIcon name="profile" />
                                <input
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    type="text"
                                    placeholder="Martín"
                                    className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]"
                                />
                            </div>
                        </label>

                        <label className="block text-sm font-medium text-[#374151]">
                            Apellido
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                                <UiIcon name="profile" />
                                <input
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    type="text"
                                    placeholder="Gómez"
                                    className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]"
                                />
                            </div>
                        </label>
                    </div>

                    {error ? <p className="mt-4 rounded-2xl bg-[#fff2f6] px-4 py-3 text-sm font-medium text-[#be3460]">{error}</p> : null}
                    {success ? <p className="mt-4 rounded-2xl bg-[#eefbf4] px-4 py-3 text-sm font-medium text-[#20814e]">{success}</p> : null}

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="submit"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#d25b8a] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#d25b8a33] transition hover:-translate-y-0.5 hover:bg-[#c24f7f] disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={loading}
                        >
                            <UiIcon name="edit" />
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>

                        <a
                            href="/profile"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(108,142,252,0.18)] bg-white px-5 py-3.5 text-sm font-semibold text-[#4566d9] transition hover:bg-[#f5f8ff]"
                        >
                            <UiIcon name="arrow-left" />
                            Volver
                        </a>
                    </div>
                </form>
            </div>
        </section>
    )
}