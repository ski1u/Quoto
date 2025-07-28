import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabaseAction } from "@/utils/supabase/client"


export const queryKey = ["quotos"]

const onError = <TData>(
    queryClient: QueryClient,
    queryKey: string[],
    context: any
) => {
    if (context?.prevQuotos) queryClient.setQueryData(
        queryKey,
        context.prevQuotos
    )
}
const onSettled = (
    queryClient: QueryClient,
    queryKey: string[]
) => queryClient.invalidateQueries({ queryKey })
const onMutateBP = async <TData>(
    queryClient: QueryClient,
    queryKey: string[],
    updater: (old: TData | undefined) => TData
) => {
    await queryClient.cancelQueries({ queryKey })
    const prevQuotos = queryClient.getQueryData<TData>(queryKey)

    queryClient.setQueryData<TData>(queryKey, updater)
    return { prevQuotos }
}

export const createOptimisticMutation = <TData, TVariables>(
    queryKey: string[],
    mutationFn: (variables: TVariables) => Promise<any>,
    updater: (old: TData, variables: TVariables) => TData,
  ) => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn,
      onMutate: async (variables: TVariables) =>
        onMutateBP(queryClient, queryKey, (old) => updater((old ?? []) as TData, variables)),
      onError: (_err, _variables, context) =>
        onError(queryClient, queryKey, context),
      onSettled: () => onSettled(queryClient, queryKey)
    })
  }

export function useCreateQuoto() {
    return createOptimisticMutation<
        any[],
        { quoto: string; tags?: string[]; private: boolean }
    >(
        queryKey,
        async (args) => {
            console.log("ran")
            const { supabase, user, metadata } = await supabaseAction()
            const { data, error } = await supabase.from("quotos").insert({
              ...args,
              author: metadata.full_name as string,
              user_id: user?.id,
              likes: 0
            }).single(); if (error) console.log(error)
            return data
        },
        (old, newQuoto) => [...(old ?? []), { id: Date.now(), ...newQuoto, optimistic: true }]
    )
}
export function useUpdateQuoto() {
    return createOptimisticMutation<
        any[],
        { id: string, quoto: string, tags?: string[], private: boolean }
    >(
        queryKey,
        async (args) => {
            const { supabase, user, metadata } = await supabaseAction()
            const { data, error } = await supabase.from("quotos").update({
              ...args,
              author: metadata.full_name as string,
              user_id: user?.id,
            }).match({
                user_id: user?.id,
                id: args.id
            }).single(); if (error) console.log(error)
            return data
        },
        (old, updatedQuoto) => (old ?? []).map(
            q => q.id === updatedQuoto.id ? {
                ...q,
                ...updatedQuoto,
                optimistic: true,
                // updated_at: new Date().toISOString()
            } : q
        )
    )
}
export function useDeleteQuoto() {
    return createOptimisticMutation<
        any[],
        { id: string }
    >(
        queryKey,
        async (args) => {
            const { supabase, user } = await supabaseAction()
            const { data, error } = await supabase.from("quotos")
            .delete().match({
                user_id: user?.id,
                id: args.id
            }); if (error) console.log(error)
            return data
        },
        (old, deletedQuoto) => (old ?? []).filter(
            q => q.id !== deletedQuoto.id
        )
    )
}