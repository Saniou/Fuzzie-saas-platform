import { CardBody, CardContainer, CardItem } from '@/components/global/3d-card'
import { HeroParallax } from '@/components/global/connect-parallax'
import { ContainerScroll } from '@/components/global/container-scroll-animation'
import { InfiniteMovingCards } from '@/components/global/infinite-moving-cards'
import { LampComponent } from '@/components/global/lamp'
import Navbar from '@/components/global/navbar'
import BackgroundGradientAnimation from '@/components/global/background-gradient-animations'
import { Button } from '@/components/ui/button'
import { clients, products } from '@/lib/constant'
import { CheckIcon } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative z-10 flex flex-col items-center">
      <div className="pointer-events-none fixed inset-0 -z-50">
        <BackgroundGradientAnimation />
      </div>
      <Navbar />

      <section className="
          relative w-full 
          min-h-[calc(100svh-4rem)]
          -pt-16  
          pb-0 md:pb-10
          bg-transparent antialiased
          flex flex-col items-center !overflow-visible
        "
      >
        <div className="absolute inset-0 h-full w-full px-5 py-24" />
        <div className="flex flex-col">
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center gap-4 md:gap-6">
                <Button
                  size="lg"
                  className="
                    p-6 md:p-8 mb-6 md:mb-8
                    text-lg md:text-2xl
                    w-full sm:w-auto
                    border-t-2 rounded-full
                    border-[#4D4D4D] bg-[#1F1F1F]
                    hover:bg-white group transition-all
                    flex items-center justify-center gap-4
                    hover:shadow-xl hover:shadow-neutral-500 duration-500
                  "
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600 font-sans group-hover:from-black group-hover:to-black">
                    Start For Free Today
                  </span>
                </Button>
                <h1
                  className="
                    pb-6 md:pb-10 text-center font-sans font-bold bg-clip-text text-transparent
                    bg-gradient-to-b from-white to-neutral-600
                    text-[clamp(2rem,6vw,6rem)]
                    leading-[0.95]
                  "
                >
                  Automate Your Work With Fuzzie
                </h1>
              </div>
            }
          />
        </div>
      </section>

      <section className="w-full py-12 sm:py-16">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <InfiniteMovingCards
            className="w-full"
            items={clients}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      <section className="relative w-full overflow-hidden pt-16 md:pt-24">
        <HeroParallax products={products} />
      </section>

      <section className="relative w-full z-10">
        <LampComponent />
        <div className="mx-auto mt-[-6rem] max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          <CardContainer className="inter-var">
            <CardBody className="relative bg-transparent border border-white/10 dark:hover:shadow-2xl dark:hover:shadow-neutral-500/10 w-full h-auto rounded-xl p-6">
              <CardItem translateZ="50" className="text-xl font-bold text-white">
                Hobby
                <h2 className="text-5xl md:text-6xl">$0</h2>
              </CardItem>
              <CardItem translateZ="60" className="mt-2 text-sm text-neutral-300">
                Get a glimpse of what our software is capable of. Just a heads up you&apos;ll never leave us after this!
                <ul className="my-4 space-y-2">
                  <li className="flex items-center gap-2"><CheckIcon /> 3 Free automations</li>
                  <li className="flex items-center gap-2"><CheckIcon /> 100 tasks per month</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Two-step Actions</li>
                </ul>
              </CardItem>
              <div className="mt-8 flex items-center justify-between">
                <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl text-xs text-white">Try now →</CardItem>
                <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold">Get Started Now</CardItem>
              </div>
            </CardBody>
          </CardContainer>

          <CardContainer className="inter-var">
            <CardBody className="relative bg-transparent border border-white/10 dark:hover:shadow-2xl dark:hover:shadow-neutral-500/10 w-full h-auto rounded-xl p-6">
              <CardItem translateZ="50" className="text-xl font-bold text-white">
                Pro Plan
                <h2 className="text-5xl md:text-6xl">$29</h2>
              </CardItem>
              <CardItem translateZ="60" className="mt-2 text-sm text-neutral-300">
                Get a glimpse of what our software is capable of. Just a heads up you&apos;ll never leave us after this!
                <ul className="my-4 space-y-2">
                  <li className="flex items-center gap-2"><CheckIcon /> 3 Free automations</li>
                  <li className="flex items-center gap-2"><CheckIcon /> 100 tasks per month</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Two-step Actions</li>
                </ul>
              </CardItem>
              <div className="mt-8 flex items-center justify-between">
                <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl text-xs text-white">Try now →</CardItem>
                <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold">Get Started Now</CardItem>
              </div>
            </CardBody>
          </CardContainer>

          <CardContainer className="inter-var">
            <CardBody className="relative bg-transparent border border-white/10 dark:hover:shadow-2xl dark:hover:shadow-neutral-500/10 w-full h-auto rounded-xl p-6">
              <CardItem translateZ="50" className="text-xl font-bold text-white">
                Unlimited
                <h2 className="mt-1 text-[clamp(2.25rem,4vw,3.5rem)]">$99</h2>
              </CardItem>
              <CardItem translateZ="60" className="mt-3 text-sm text-neutral-300">
                Get a glimpse of what our software is capable of. Just a heads up {"you'll"} never leave us after this!
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2"><CheckIcon /> 3 Free automations</li>
                  <li className="flex items-center gap-2"><CheckIcon /> 100 tasks per month</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Two-step Actions</li>
                </ul>
              </CardItem>
              <div className="mt-8 flex items-center justify-between">
                <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl text-xs text-white">
                  Try now →
                </CardItem>
                <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold">
                  Get Started Now
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>
      </section>
    </main >
  )
}
