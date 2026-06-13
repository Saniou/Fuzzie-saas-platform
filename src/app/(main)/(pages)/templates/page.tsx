import React from 'react'
import Image from 'next/image'
import { WORKFLOW_TEMPLATES } from '@/lib/templates'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import UseTemplateButton from './_components/use-template-button'

const TemplatesPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <h1 className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 p-4 md:p-6 text-3xl md:text-4xl font-bold backdrop-blur-lg">
        Templates
      </h1>

      <div className="p-2 md:p-6">
        <p className="mb-6 text-muted-foreground">
          Start from a ready-made automation. Pick a template and we&apos;ll add
          it to your workflows — edit the steps and messages, then publish.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOW_TEMPLATES.map((template, index) => (
            <Card
              key={template.id}
              className="group flex flex-col border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-in fade-in-50 slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex w-fit items-center gap-1 rounded-lg bg-muted/40 p-2 transition-colors duration-300 group-hover:bg-muted">
                    {template.icons.map((icon, i) => (
                      <Image
                        key={`${template.id}-icon-${i}`}
                        src={icon}
                        alt=""
                        width={26}
                        height={26}
                        className="object-contain"
                      />
                    ))}
                  </div>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
                <CardTitle className="text-lg transition-colors duration-300 group-hover:text-primary">
                  {template.name}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-1">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Google Drive
                  </span>
                  {template.actions.map((action) => (
                    <span
                      key={action}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <UseTemplateButton templateId={template.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TemplatesPage
