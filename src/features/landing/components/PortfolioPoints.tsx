import { CheckSquareIcon } from "@/components/icons/CheckSquareIcon"

const portfolioPoints = [
    {
        number: 1,
        title: "지원 직무 & JD에 적합한 Fit 발굴"
    },
    {
        number: 2,
        title: "명확한 가이드라인으로 빠른 포트폴리오 개선 가능"
    },
    {
        number: 3,
        title: "심층 기업 분석 정보 제공 및 맞춤 첨삭"
    }
];

export const PortfoliloPoints = () => {
    return (
        <div className="flex flex-col gap-[1.5rem] w-[46.25rem] mx-auto">
            {portfolioPoints.map((point) => (
                <div 
                    key={point.number}
                    className="flex justify-between items-center px-[2.5rem] py-[1.75rem] bg-[#FFFFFF] shadow-[2px_4px_12px_0px_rgba(0,0,0,0.2)_inset] rounded-[1.75rem]"
                >
                    <div className="flex flex-col gap-[0.75rem]">
                        <div className="flex items-center gap-[0.5rem]">
                            <CheckSquareIcon />
                            <span className="text-[1.25rem] font-bold leading-[130%] text-[#9EA4A9]">
                                POINT {point.number}.
                            </span>
                        </div>
                        <h3 className="text-[1.5rem] font-bold text-[#5060C5] leading-[130%]">
                            {point.title}
                        </h3>
                    </div>
                    <div className="w-[6rem] h-[6rem] bg-[#D9D9D9]" />
                </div>
            ))}
        </div>
    )
}