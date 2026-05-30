"use client";

import { FormEvent, useState, useTransition } from "react";

import { CodespaceStatus } from "@/components/CodespaceStatus";
import {
  searchCodespace,
  startCodespace,
  stopCodespace,
} from "@/services/codespaceClient";
import type { CodespaceSummary } from "@/types/Codespace";

type Operation = "search" | "start" | "stop";

export function CodespaceControlPanel() {
  const [query, setQuery] = useState("");
  const [secret, setSecret] = useState("");
  const [codespace, setCodespace] = useState<CodespaceSummary | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [message, setMessage] = useState("Enter a codespace name or display name.");
  const [activeOperation, setActiveOperation] = useState<Operation | null>(null);
  const [isPending, startTransition] = useTransition();
  const isBusy = isPending || activeOperation !== null;
  const canSubmit = query.trim().length > 0 && secret.length > 0 && !isBusy;

  function handleSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    runSearch();
  }

  function handleStart() {
    runStart();
  }

  function handleStop() {
    runStop();
  }

  function runSearch() {
    const request = buildRequest();

    if (!request) {
      return;
    }

    setActiveOperation("search");
    setMessage("Searching codespaces...");

    startTransition(async () => {
      try {
        const response = await searchCodespace(request);

        if (!response.found) {
          setCodespace(null);
          setFound(false);
          setMessage("No matching codespace was found.");
          return;
        }

        setCodespace(response.codespace);
        setFound(true);
        setMessage("Codespace found.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Search failed.");
      } finally {
        setActiveOperation(null);
      }
    });
  }

  function runStart() {
    const request = buildRequest();

    if (!request) {
      return;
    }

    setActiveOperation("start");
    setMessage("Starting codespace...");

    startTransition(async () => {
      try {
        const response = await startCodespace(request);

        if (!response.started) {
          setCodespace(null);
          setFound(false);
          setMessage("No matching codespace was found.");
          return;
        }

        setCodespace(response.codespace);
        setFound(true);
        setMessage("Start request accepted.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Start failed.");
      } finally {
        setActiveOperation(null);
      }
    });
  }

  function runStop() {
    const request = buildRequest();

    if (!request) {
      return;
    }

    setActiveOperation("stop");
    setMessage("Stopping codespace...");

    startTransition(async () => {
      try {
        const response = await stopCodespace(request);

        if (!response.stopped) {
          setCodespace(null);
          setFound(false);
          setMessage("No matching codespace was found.");
          return;
        }

        setCodespace(response.codespace);
        setFound(true);
        setMessage("Stop request accepted.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Stop failed.");
      } finally {
        setActiveOperation(null);
      }
    });
  }

  function buildRequest() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || !secret) {
      setMessage("Both fields are required.");
      return null;
    }

    return {
      key: secret,
      query: trimmedQuery,
    };
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-5 py-8">
      <form
        onSubmit={handleSearch}
        className="grid gap-4 border border-stone-300 bg-white p-5"
      >
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">
            Codespace name or display name
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 border border-stone-300 px-3 text-stone-950 outline-none transition focus:border-stone-950"
            placeholder="my-codespace"
            autoComplete="off"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">
            Secret string
          </span>
          <input
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            className="h-11 border border-stone-300 px-3 text-stone-950 outline-none transition focus:border-stone-950"
            type="password"
            placeholder="Shared POST secret"
            autoComplete="off"
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex size-11 items-center justify-center border border-stone-950 bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-300"
            aria-label="Refresh codespace status"
            title={activeOperation === "search" ? "Refreshing" : "Refresh"}
          >
            <RefreshIcon />
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={!canSubmit}
            className="inline-flex size-11 items-center justify-center border border-emerald-700 bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-300"
            aria-label="Start codespace"
            title={activeOperation === "start" ? "Starting" : "Start"}
          >
            <PlayIcon />
          </button>
          <button
            type="button"
            onClick={handleStop}
            disabled={!canSubmit}
            className="inline-flex size-11 items-center justify-center border border-red-700 bg-red-700 text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-300"
            aria-label="Stop codespace"
            title={activeOperation === "stop" ? "Stopping" : "Stop"}
          >
            <StopIcon />
          </button>
        </div>
      </form>

      <CodespaceStatus
        codespace={codespace}
        found={found}
        message={message}
      />
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M7 7h10v10H7z" />
    </svg>
  );
}
