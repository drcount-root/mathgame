"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { GithubIcon, TwitterIcon, LinkedinIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center my-6 w-full">
      <div className="px-4 py-8 bg-background text-foreground">
        <main className="w-[1024px]">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Features We Are Offering
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-primary p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
                  <p>Description of feature {i}...</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">General FAQ&apos;s</h2>
            <Accordion type="single" collapsible className="w-full">
              {[1, 2, 3].map((i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>Question {i}</AccordionTrigger>
                  <AccordionContent>Answer to question {i}...</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message" />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </section>
        </main>

        <footer className="flex justify-between items-center pt-8 border-t border-border">
          <p>
            Developed by{" "}
            <Link
              href="https://github.com/drcount-root"
              target="_blank"
              className="font-semibold text-yellow-500"
            >
              @Subham Sahu
            </Link>
          </p>
          <div className="flex gap-4">
            <Link
              href="https://github.com/drcount-root"
              target="_blank"
              className="text-foreground hover:text-primary"
            >
              <GithubIcon />
            </Link>
            <Link
              href="https://twitter.com/about_subham"
              target="_blank"
              className="text-foreground hover:text-primary"
            >
              <TwitterIcon />
            </Link>
            <Link
              href="https://www.linkedin.com/in/about-subham-sahu/"
              target="_blank"
              className="text-foreground hover:text-primary"
            >
              <LinkedinIcon />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
