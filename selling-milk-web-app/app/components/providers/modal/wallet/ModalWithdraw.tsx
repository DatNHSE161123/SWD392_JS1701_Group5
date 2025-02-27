"use client"

import { GlobalContext } from "@/contexts"
import { useWithdrawModal } from "@/hooks/useWallet"
import { useContext, useState } from "react"
import useSWR, { mutate } from "swr"
import { LoadingActionWallet } from "../../loader"
import Image from "next/image"
import CustomModal from "../Modal"
import Select from 'react-select'
import Input from "../../form/Input"
import Button from "../../form/Button"
import { useForm } from "react-hook-form"
import { WalletFrom } from "@/types"
import { yupResolver } from "@hookform/resolvers/yup"
import { walletSchema } from "@/utils/schema"
import { withdrawService } from "@/services/wallet"
import { toast } from "react-toastify"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface option {
    value: string,
    label: string,
    image: string
}

interface ListBank {
    data: {
        name: string
        shortName: string
        logo: string
    }[]
}

const ModalWithdraw = () => {
    const withdrawModal = useWithdrawModal()
    const [selected, setSelected] = useState<option>()
    const { data: listBankData } = useSWR<ListBank>('https://api.vietqr.io/v2/banks', fetcher, { revalidateOnFocus: false, revalidateOnReconnect: false })

    const options = listBankData && listBankData.data.map(bank => ({
        value: bank.name,
        label: bank.shortName,
        image: bank.logo,
    }))

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            border: 'none',
            paddingLeft: '1rem',
            marginLeft: '0px',
            backgroundColor: '#F5F5F5',
            paddingTop: '5px',
            paddingBottom: '5px',
            boxShadow: 'none !important',
            "*": {
                boxShadow: "none !important",
            },
            '&:hover': {
                border: 'none !important',
                boxShadow: 'none !important',
                outline: 'none !important',
            },
            '&:focus': {
                border: 'none !important',
                boxShadow: 'none !important',
                outline: 'none !important',
            },
        }),
        menuList: (provided: any, state: any) => ({
            ...provided,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gridGap: '10px',
        })
    }

    const { user, setIsLoadingModal, isLoadingModal } = useContext(GlobalContext) || {}

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<WalletFrom>({
        resolver: yupResolver(walletSchema)
    })

    const handleSelect = (option: any) => {
        setSelected(option)
    }

    const onSubmit = async (data: WalletFrom) => {
        if (setIsLoadingModal) setIsLoadingModal(true)

        if (!selected) {
            setError("bankName", { message: "Không được để trống" })
            if (setIsLoadingModal) setIsLoadingModal(false)
            return
        }

        if (user) {
            const res = await withdrawService(user._id, data.amount)

            if (res.data == null) {
                toast.error(res.message, {
                    position: "top-right"
                })
                if (setIsLoadingModal) setIsLoadingModal(false)
                return
            }

            toast.success("Rút tiền thành công", {
                position: "top-right"
            })

            mutate(`/wallet/getWallet?userId=${user._id}`)
            withdrawModal.onClose()
            reset()
        }

        if (setIsLoadingModal) setIsLoadingModal(false)
    }

    if (isLoadingModal) {
        return <LoadingActionWallet loading={isLoadingModal} />
    }

    const formatOptionLabel = ({ value, label, image }: { value: string, label: string, image: string }, { context }: { context: string }) => {
        if (context === 'menu') {
            return (
                <div className="flex flex-col gap-1 items-center">
                    <Image src={image} alt={label} width="200" height="200" className="mr-2 object-contain w-14 h-10" />
                    <span className="text-base">{label}</span>
                </div>
            );
        } else {
            return value;
        }
    }

    return (
        <CustomModal
            isOpen={withdrawModal.isOpen}
            onClose={withdrawModal.onClose}
            title="Rút tiền về tài khoản"
            width="w-full lg:w-2/4 md:3/4 max-w-full"
            height="h-auto"
        >
            <div className="relative flex flex-col justify-center items-center gap-5 py-5">
                <form className="relative flex flex-col gap-3 w-full px-2 md:px-10" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-3 w-full text-left">
                        <label className="text-gray-600 text-xl font-semibold">
                            Chọn ngân hàng:
                        </label>
                        <Select
                            options={options}
                            formatOptionLabel={formatOptionLabel}
                            value={selected}
                            onChange={handleSelect}
                            styles={customStyles}
                            placeholder="Chọn ngân hàng"
                            className="text-xl"
                        />
                        {errors.bankName && (
                            <p className="text-red-500 font-medium h-4 text-left">
                                {errors.bankName?.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <label className="text-gray-600 text-xl font-semibold text-left">
                            Nhập số tài khoản:
                        </label>
                        <Input
                            colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                            id="bankNumber"
                            name="bankNumber"
                            type="text"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <label className="text-gray-600 text-xl font-semibold text-left">
                            Nhập tên chủ tài khoản:
                        </label>
                        <Input
                            colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                            id="accountName"
                            name="accountName"
                            type="text"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <label className="text-gray-600 text-xl font-semibold text-left">
                            Nhập số tiền cần rút:
                        </label>
                        <Input
                            isMoney
                            colorInput="w-full bg-[#F5F5F5] text-gray-600 text-xl"
                            id="amount"
                            type="number"
                            name="amount"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <div className="relative flex self-end">
                        <Button
                            title="Gửi"
                            style="py-3 px-12"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </CustomModal>
    )
}

export default ModalWithdraw